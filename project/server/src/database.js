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
    "CREATE TABLE IF NOT EXISTS Users (id TEXT, username TEXT, password TEXT, country TEXT, city TEXT, postalcode TEXT, nr TEXT)"
  );

  await db.run(
    "CREATE TABLE IF NOT EXISTS Ads (username TEXT, id TEXT, title TEXT, body TEXT, price TEXT, filename TEXT)"
  );

  return db;
})();
