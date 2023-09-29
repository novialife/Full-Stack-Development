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

// När man gör: / -> GET korresponderande assets -> /api/users/me

// Hämtar userID
// Kollar ifall user finns i modellen som innehåller alla users
// Ifall inte, returnerar felmeddelande
// Annars låter gå vidare

const checkAdmin = (req, res, next) => {
  const { id } = req.session;
  const user = model.findUserById(id);
  console.log("Im in checkAdmin now with the following user:", user);
  if (
    !user.isAdmin &&
    (req.url === "/admin/profile" || req.url === "/admin/profile/addTime")
  ) {
    res.status(403).end();
  }
  next();
};

router.post("/admin/login", async (req, res) => {
  // Check how to access data being sent as a path, query, header and cookie parameter or in the HTTP request body.
  const { username } = req.body;
  const { password } = req.body;

  const { id } = req.session;
  if (model.findUserById(id) !== undefined) {
    res.status(403).end();
    return;
  }

  const sql = await db.prepare(
    "SELECT username, password FROM Admins WHERE username = ?"
  );
  const users = await sql.get(username);

  if (users !== undefined) {
    const result = await bcrypt.compare(password, users.password);
    if (result) {
      const cookie = uuidv4();
      res.cookie("session-id", cookie);
      res.status(200).json({ authenticated: true });
      if (model.findUserById(id) === undefined) {
        model.createUser(id, username, true);
      } else {
        model.users[id].isAdmin = true;
      }
      req.session.save((err) => {
        if (err) console.error(err);
        else
          console.debug(
            `Saved user: ${JSON.stringify(model.findUserById(id))}`
          );
      });
      return;
    }
  }

  res.status(200).json({ authenticated: false });
});

router.post("/admin/register", async (req, res) => {
  // Check how to access data being sent as a path, query, header and cookie parameter or in the HTTP request body.
  const { username } = req.body;
  const { password } = req.body;
  const { confirm } = req.body;

  const { id } = req.session;
  if (model.findUserById(id) !== undefined) {
    res.status(403).end();
    return;
  }

  if (confirm !== password) {
    console.log("Wrong confirm");
    res.status(200).json({ authenticated: false });
  } else {
    const sql = await db.prepare(
      "SELECT username, password FROM Admins WHERE username = ?"
    );
    const users = await sql.get(username);

    if (users !== undefined) {
      console.log("User already exists!");
      res.status(200).json({ authenticated: false });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const addUser = await db.prepare(
      "INSERT INTO Admins(username, password, cookie) VALUES(?,?,?)"
    );
    await addUser.run(username, hashed, id);
    res.status(200).json({ authenticated: true });
  }
});

router.post("/logout", (req, res) => {
  const { id } = req.session;
  const user = model.findUserById(id);

  if (user === undefined || !user.isAdmin) {
    res.status(403).end();
    return;
  }

  user.isAdmin = false;
  model.deleteUser(id);
  res.clearCookie("session-id");
  res.status(200).json({ admin: false });
});

export default { router, checkAdmin };
