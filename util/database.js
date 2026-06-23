import * as SQLite from "expo-sqlite";

let database;

async function getDatabase() {
  if (!database) {
    database = await SQLite.openDatabaseAsync("places.db");
  }
  return database;
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
      lng REAL NOT NULL
    );
  `);
}

export async function insertPlace(place) {
  const db = await getDatabase();
  const result = await db.runAsync(`INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?)`, [
    place.title,
    place.imageUri,
    place.address,
    place.location.lat,
    place.location.lng,
  ]);
  console.log(result);
  return result;
}

export async function fetchPlaces() {
  const db = await getDatabase();
  const result = await db.getAllAsync("SELECT * FROM places");
  return result;
}

export async function fetchPlaceById(id) {
  const db = await getDatabase();
  const place = await db.getFirstAsync("SELECT * FROM places WHERE id = ?", [id]);
  return place;
}

export async function deletePlace(id) {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM places WHERE id = ?", [id]);
}
