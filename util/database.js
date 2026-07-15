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
      category TEXT NOT NULL DEFAULT '${DEFAULT_CATEGORY}'
    );
  `);
}

export async function insertPlace(place) {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO places (title, imageUri, address, lat, lng, category) VALUES (?, ?, ?, ?, ?, ?)`,
    [place.title, place.imageUri, place.address, place.location.lat, place.location.lng, place.category],
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

export async function fetchPlaces() {
  const db = await getDatabase();
  const result = await db.getAllAsync("SELECT * FROM places");
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
