import { Router } from "express";
import model from "../model.js";

const router = Router();

// Ändra så att när man get requestar sidan så ändras variabeln till pending eller något
router.get("/timeslots/:id", async (req, res) => {
  const TimeSlotID = req.params.id;
  console.log(TimeSlotID, "TimeSlotId");
  const { id, socketID } = req.session;

  const user = model.findUserById(id);

  const currTimeSlot = model.findTimeSlot(TimeSlotID);

  currTimeSlot.reservedByID = user.id;
  currTimeSlot.reservedBy = user.name;

  model.TimeSlots[TimeSlotID] = currTimeSlot;
  const newTimes = model.getTimeSlots();

  user.joinRoom("TimeSlots");
  model.join(socketID, "TimeSlots");

  model.io.to("TimeSlots").emit("updateTimes", newTimes);
  res.status(200).end();
});

router.post("/timeslots/:id/cancel", (req, res) => {
  const TimeSlotID = req.params.id;

  const { id, socketID } = req.session;

  const user = model.findUserById(id);

  user.joinRoom("TimeSlots");
  model.join(socketID, "TimeSlots");

  const currTimeSlot = model.findTimeSlot(TimeSlotID);
  currTimeSlot.reservedByID = null;
  currTimeSlot.reservedBy = "EMPTY";

  model.TimeSlots[TimeSlotID] = currTimeSlot;
  const newTimes = model.getTimeSlots();

  model.io.to("TimeSlots").emit("updateTimes", newTimes);
  res.status(200).end();
});

export default { router };
