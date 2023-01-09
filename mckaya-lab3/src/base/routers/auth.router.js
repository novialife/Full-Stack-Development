import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../database.js";
import sessionManager from "../sessionManager.js";

const publicRouter = Router();
const privateRouter = Router();
const session = sessionManager;

publicRouter.post("/login", async (req, res) => {
  const { username } = req.body;
  const { password } = req.body;

  const sql = await db.prepare(
    "SELECT username, password FROM Users WHERE username = (?)"
  );
  const users = await sql.get(username);

  if (users === undefined) {
    res.redirect("/login?error=Wrong%20Username");
  } else {
    const result = await bcrypt.compare(password, users.password);
    if (result) {
      session.id = session.createNewSession();
      session.authorized = true;
      session.username = username;
      session.time = Date.now();
      const insertCookie = await db.prepare(
        "UPDATE Users Set cookie = ? WHERE username = ?"
      );
      await insertCookie.run(session.id.id, username);
      res.cookie("session-id", session.id.id).redirect("/");
    } else {
      res.redirect("/login?error=Wrong%20Password");
    }
  }
});

publicRouter.post("/registration", async (req, res) => {
  const { username } = req.body;
  const { password } = req.body;
  const { confirm } = req.body;

  const sql = await db.prepare(
    "SELECT username, password FROM Users WHERE username = ?"
  );
  const users = await sql.get(username);

  if (users !== undefined) {
    res.redirect("/registration?error=User%20Exists");
  } else if (password !== confirm) {
    res.redirect("/registration?error=Wrong%20Confirm");
  } else if (password.length < 3) {
    res.redirect("/registration?error=Wrong%20Password%20Length");
  } else if (username.length < 3) {
    res.redirect("/registration?error=Wrong%20Username%20Length");
  } else if (!/\d/.test(username) || !/[a-zA-Z]/.test(username)) {
    res.redirect("/registration?error=Wrong%20Username%20Format");
  } else if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
    res.redirect("/registration?error=Wrong%20Password%20Format");
  } else {
    const hashed = await bcrypt.hash(password, 10);
    const addUser = await db.prepare(
      "INSERT INTO Users(username, password) VALUES(?,?)"
    );
    await addUser.run(username, hashed);
    res.redirect("/login?success=Account%20Created");
  }
});

privateRouter.post("/logout", async (req, res) => {
  const cookies = req.headers.cookie.replace("session-id=", "");
  session.deleteSession(cookies);
  session.authorized = false;
  session.username = undefined;
  res.clearCookie("session-id");
  const deleteCookie = await db.prepare(
    "UPDATE Users SET cookie = null WHERE cookie = ?"
  );
  await deleteCookie.run(cookies);
  res.redirect("/login?success=Please%20Sign%20In");
});

export default {
  publicRouter,
  privateRouter,
};
