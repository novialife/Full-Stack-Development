import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import model from "../model.js";
import db from "../database.js";

const router = Router();

/**
 * requireAuth is a middleware function that limit access to an endpoint to authenticated users.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns {void}
 */

const checkAuth = (req, res, next) => {
  const { id } = req.session;
  const user = model.findUserById(id);

  if (
    user !== undefined &&
    user.isAuth &&
    (req.url === "/login" || req.url === "/register")
  ) {
    res.status(403).end();
  }

  if (
    user !== undefined &&
    !user.isAuth &&
    (req.url === "/profile/" || req.url === "/new")
  ) {
    res.status(403).end();
  }
  next();
};

router.get("/users/me", (req, res) => {
  const { id } = req.session;
  const user = model.findUserById(id);

  res.status(200).json({ authenticated: user !== undefined });
});

router.post("/login", async (req, res) => {
  // Check how to access data being sent as a path, query, header and cookie parameter or in the HTTP request body.
  const { username } = req.body;
  const { password } = req.body;
  const { id, socketID } = req.session;

  const sql = await db.prepare("SELECT * FROM Users WHERE username = ?");
  const user = await sql.get(username);

  if (user !== undefined) {
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      model.createUser(
        id,
        username,
        user.country,
        user.city,
        user.postalcode,
        user.nr,
        true
      );

      const curr = model.findUserById(id);
      curr.createActivity(socketID);

      const cookie = uuidv4();
      res.cookie("session-id", cookie);
      res.status(200).json({ authenticated: true });
    } else {
      res.status(200).json({ authenticated: false });
    }
  } else {
    res.status(200).json({ authenticated: false });
  }
});

router.post("/register", async (req, res) => {
  // Check how to access data being sent as a path, query, header and cookie parameter or in the HTTP request body.
  const { username } = req.body;
  const { password } = req.body;
  const { confirm } = req.body;
  const { country } = req.body;
  const { city } = req.body;
  const { postalcode } = req.body;
  const { nr } = req.body;

  const { id } = req.session;

  if (confirm !== password) {
    console.log("Wrong confirm");
    res.status(200).json({ authenticated: false });
  } else {
    const sql = await db.prepare(
      "SELECT username, password FROM Users WHERE username = ?"
    );

    const users = await sql.get(username);
    if (users !== undefined) {
      console.log("User already exists!");
      res.status(200).json({ authenticated: false });
    } else {
      const hashed = await bcrypt.hash(password, 10);
      const addUser = await db.prepare(
        "INSERT INTO Users(id, username, password, country, city, postalcode, nr) VALUES(?, ?, ?, ?, ?, ?, ?)"
      );
      await addUser.run(id, username, hashed, country, city, postalcode, nr);
      res.status(200).json({ authenticated: true });
    }
  }
});

router.post("/logout", (req, res) => {
  const { id } = req.session;
  const user = model.findUserById(id);
  console.log(user, "The user when logging out");

  if (!user.isAuth || user === undefined) {
    res.status(403).end();
    return;
  }

  user.isAuth = false;
  res.clearCookie("session-id");
  req.session.destroy(() => {
    console.log("Session destroyed");
  });
  res.status(200).json({ authenticated: false }).end();
});

export default { router, checkAuth };
