import { Router } from "express";
import model from "../model.js";

const router = Router();

// Ändra så att när man get requestar sidan så ändras variabeln till pending eller något
router.get("/timeslots/:id", async (req, res) => {
  const TimeSlotID = req.params.id;
  const { id } = req.session;
  const currTimeSlot = model.findTimeSlot(TimeSlotID);

  currTimeSlot.reservedByID = id;

  model.TimeSlots[TimeSlotID] = currTimeSlot;
  const newTimes = model.getTimeSlots();

  model.io.emit("updateTimes", newTimes);
  model.startTimer(TimeSlotID);
  res.status(200).end();
});

router.post("/timeslots/:id/cancel", (req, res) => {
  const TimeSlotID = req.params.id;

  const currTimeSlot = model.findTimeSlot(TimeSlotID);
  currTimeSlot.reservedByID = null;

  model.TimeSlots[TimeSlotID] = currTimeSlot;
  model.stopTimer(TimeSlotID);
  const newTimes = model.getTimeSlots();

  model.io.emit("updateTimes", newTimes);
  res.status(200).end();
});

export default { router };
