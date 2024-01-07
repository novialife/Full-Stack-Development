import { v4 as uuidv4 } from "uuid";
import db from "../database.js";

/**
 * @class User
 */
class User {
  constructor(id, name, country, city, postalcode, nr, auth) {
    this.id = id;
    this.name = name;
    this.country = country;
    this.city = city;
    this.postalcode = postalcode;
    this.nr = nr;
    this.isAuth = auth;
    this.times = new Map();
  }

  async makeAd(title, body, price, image) {
    const sql = await db.prepare(
      "INSERT INTO Ads (username, id, title, body, price, filename) VALUES (?, ?, ?, ?, ?, ?)"
    );
    await sql.run(this.name, uuidv4(), title, body, price, image.filename);
  }

  async getAds() {
    const res = await db.all("SELECT * FROM Ads WHERE username = ?", this.name);
    return res;
  }

  createActivity(sessionID) {
    const time = new Date();
    this.times.set(sessionID, time);
  }

  getActivity(sessionID) {
    const time = this.times.get(sessionID);
    const now = new Date();
    const diff = now - time;

    console.warn(diff);
    // One min of inactivity
    if (diff > 1000 * 60) {
      this.times.delete(sessionID);
      return false;
    }
    return true;
  }

  updateActivity(sessionID) {
    this.times.set(sessionID, new Date());
  }

  checkActivity(sessionID) {
    const time = this.times.get(sessionID);
    const now = new Date();
    const diff = now - time;

    console.warn(diff);
    // One min of inactivity
    if (diff > 1000 * 60) {
      this.times.delete(sessionID);
      return false;
    }
    return true;
  }
}
export default User;
