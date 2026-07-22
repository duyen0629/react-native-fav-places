import * as SQLite from "expo-sqlite";
import { DEFAULT_CATEGORY } from "../constants/categories";
import { parseImageUris } from "./images";

let database;

async function getDatabase() {
  if (!database) {
    database = await SQLite.openDatabaseAsync("places.db");
  }
  return database;
}

function mapPlaceRow(row) {
  if (!row) {
    return null;
  }
  const imageUris = parseImageUris(row.imageUri);
  return {
    ...row,
    alertEnabled: Boolean(row.alertEnabled),
    imageUris,
  };
}

export async function init() {
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      imageUri TEXT NOT NULL,
      address TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      category TEXT NOT NULL DEFAULT '${DEFAULT_CATEGORY}',
      alertEnabled INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);

  const columns = await db.getAllAsync("PRAGMA table_info(places)");
  const hasAlertEnabled = columns.some((column) => column.name === "alertEnabled");
  if (!hasAlertEnabled) {
    await db.execAsync("ALTER TABLE places ADD COLUMN alertEnabled INTEGER NOT NULL DEFAULT 0");
  }
}

export async function insertPlace(place) {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO places (title, imageUri, address, lat, lng, category, alertEnabled) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      place.title,
      place.imageUri,
      place.address,
      place.location.lat,
      place.location.lng,
      place.category,
      place.alertEnabled ? 1 : 0,
    ],
  );
  return result;
}

export async function updatePlace(id, place) {
  const db = await getDatabase();
  const result = await db.runAsync(
    `UPDATE places SET title = ?, imageUri = ?, address = ?, lat = ?, lng = ?, category = ? WHERE id = ?`,
    [place.title, place.imageUri, place.address, place.location.lat, place.location.lng, place.category, id],
  );
  return result;
}

export async function updatePlaceAlertEnabled(id, enabled) {
  const db = await getDatabase();
  await db.runAsync("UPDATE places SET alertEnabled = ? WHERE id = ?", [enabled ? 1 : 0, id]);
}

export async function fetchPlaces() {
  const db = await getDatabase();
  const result = await db.getAllAsync("SELECT * FROM places");
  return result.map(mapPlaceRow);
}

export async function fetchAlertPlaces(limit = 20) {
  const db = await getDatabase();
  const result = await db.getAllAsync(
    "SELECT * FROM places WHERE alertEnabled = 1 ORDER BY id DESC LIMIT ?",
    [limit],
  );
  return result.map(mapPlaceRow);
}

export async function fetchPlaceCount() {
  const db = await getDatabase();
  const result = await db.getFirstAsync("SELECT COUNT(*) as count FROM places");
  return result.count;
}

export async function fetchPlaceById(id) {
  const db = await getDatabase();
  const place = await db.getFirstAsync("SELECT * FROM places WHERE id = ?", [id]);
  return mapPlaceRow(place);
}

export async function deletePlace(id) {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM places WHERE id = ?", [id]);
}

export async function getSetting(key, fallback = null) {
  const db = await getDatabase();
  const row = await db.getFirstAsync("SELECT value FROM settings WHERE key = ?", [key]);
  return row?.value ?? fallback;
}

export async function setSetting(key, value) {
  const db = await getDatabase();
  await db.runAsync(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    [key, String(value)],
  );
}
