import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

sqlite3.verbose();

const databasePath = join(dirname(fileURLToPath(import.meta.url)), "db.sqlite");

// Open and initialize the database
export default await (async () => {
  const db = await open({
    filename: databasePath,
    driver: sqlite3.Database,
  });

  console.log(databasePath);
  await db.run(
    "CREATE TABLE IF NOT EXISTS Admins (username TEXT, password TEXT, cookie VARCHAR(255))"
  );

  await db.run(
    "CREATE TABLE IF NOT EXISTS TimeSlots (time TEXT, id VARCHAR(255), bookedBy TEXT DEFAULT 'EMPTY', bookedByID TEXT, reservedBy TEXT DEFAULT 'EMPTY', reservedByID TEXT, assistant TEXT, assistantID TEXT , room TEXT)"
  );

  return db;
})();
