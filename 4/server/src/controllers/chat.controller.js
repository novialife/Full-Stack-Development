import { Router } from "express";
import model from "../model.js";
import db from "../database.js";

// ANVÄND DENNA FÖR ATT HANTERA TIDERNA OCH RUMMEN

const router = Router();

router.get("/admin/profile", (req, res) => {
  const TimeSlots = model.getTimeSlots();
  res.status(200).json({ TimeSlots });
});

router.get("/timeslots", (req, res) => {
  const TimeSlots = model.getTimeSlots();
  res.status(200).json({ TimeSlots });
});

router.post("/admin/profile", async (req, res) => {
  const { id } = req.session;
  const user = model.findUserById(id);

  if (user === undefined || !user.isAdmin) {
    res.status(403).end();
    return;
  }

  const checkedBoxes = req.body.bookings;
  const currentTimes = model.getTimeSlots();

  const results = [];
  for (let i = 0; i < checkedBoxes.length; i += 1) {
    for (let j = 0; j < currentTimes.length; j += 1) {
      if (currentTimes[j].id === checkedBoxes[i]) {
        currentTimes.splice(j, 1);
        if (user.name !== model.findTimeSlot(checkedBoxes[i]).assistantID) {
          console.log("You are not the assistant of this timeslot");
          console.log("Could not remove timeslot");
          res.status(403).end();
          return;
        }
        results.push(model.removeTimeSlot(checkedBoxes[i], user.name));
      }
    }
  }
  await Promise.all(results);
  model.io.emit("updateTimes", currentTimes);

  res.status(200).end();
});

router.post("/admin/profile/addTime", async (req, res) => {
  const { Time } = req.body;
  const { Assistant } = req.body;
  const { Room } = req.body;

  const { id } = req.session;
  const user = model.findUserById(id);

  if (user === undefined || !user.isAdmin) {
    res.status(403).end();
    return;
  }

  model.createTimeSlot(Time, Room, Assistant, user.name);
  const currentTimes = model.getTimeSlots();

  model.io.emit("updateTimes", currentTimes);

  res.status(200).end();
});

router.post("/timeslots/:id", async (req, res) => {
  const roomID = req.params.id;
  const { username } = req.body;
  const { id } = req.session;
  const currTimeSlot = model.findTimeSlot(roomID);

  if (currTimeSlot.bookedBy !== "EMPTY") {
    res.status(403).end();
    return;
  }

  if (currTimeSlot.reservedByID !== id) {
    res.status(403).end();
    return;
  }

  currTimeSlot.bookedBy = username;
  model.TimeSlots[roomID] = currTimeSlot;

  const timeslot = currTimeSlot;
  const sql = await db.prepare(
    "UPDATE TimeSlots SET bookedBy = ?, bookedByID = ?, reservedBy = ?, reservedByID = ? WHERE id = ?"
  );
  await sql.run(
    timeslot.bookedBy,
    timeslot.bookedByID,
    timeslot.reservedBy,
    timeslot.reservedByID,
    timeslot.id
  );

  const newTimes = model.getTimeSlots();

  model.io.emit("updateTimes", newTimes);
  res.status(200).end();
});

export default { router };
