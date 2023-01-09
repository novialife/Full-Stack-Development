import { Router } from "express";
import model from "../model.js";

const router = Router();

// Ändra så att när man get requestar sidan så ändras variabeln till pending eller något
router.put("/activity", (req, res) => {
  const { id, socketID } = req.session;
  const curr = model.findUserById(id);
  curr.updateActivity(socketID);
  res.status(200).end();
});

router.get("/checkActivity", (req, res) => {
  const { id, socketID } = req.session;
  const curr = model.findUserById(id);
  const activity = curr.checkActivity(socketID);
  res.status(200).json({ activity });
});

export default { router };
