import User from "./models/user.model.js";
import TimeSlot from "./models/TimeSlot.model.js";
import db from "./database.js";

class Model {
  constructor() {
    this.users = {};
    this.TimeSlots = {};
    this.timers = {};
    this.io = undefined;
  }

  /**
   * Initialize the model after its creation.
   * @param {SocketIO.Server} io - The socket.io server instance.
   * @returns {void}
   */
  init(io) {
    this.io = io;
  }

  /**
   * Create a booking with the given time.
   * @param {String} time - The time of the slot.
   * @param {String} room - The room of the slot.
   * @param {String} assistant - The assistant of the slot.
   * @returns {TimeSlot}
   */

  async createTimeSlot(time, room, assistant, assistantID) {
    const newSlot = new TimeSlot(null, time, room, assistant, assistantID);
    this.TimeSlots[newSlot.id] = newSlot;

    const addUser = await db.prepare(
      "INSERT INTO TimeSlots(time, id, assistant, assistantID ,room) VALUES(?,?,?,?,?)"
    );
    await addUser.run(time, newSlot.id, assistant, assistantID, room);
  }

  /**
   * Return all the TimeSlots.
   * @returns {TimeSlot[]}
   */
  getTimeSlots() {
    return Object.values(this.TimeSlots);
  }

  async removeTimeSlot(id) {
    delete this.TimeSlots[id];
    const addUser = await db.prepare("DELETE FROM TimeSlots WHERE id = ?");
    await addUser.run(id);
    return true;
  }

  findTimeSlot(id) {
    return this.TimeSlots[id];
  }

  /**
   * Create a user with the given name.
   * @param {String} id - An unique identifier for the user session.
   * @param {String} name - The name of the user.
   * @param {boolean} admin - Is admin.

   * @returns {void}
   */
  createUser(id, name, admin) {
    this.users[id] = new User(name);
    if (admin) {
      this.users[id].isAdmin = true;
    }
  }

  deleteUser(id) {
    delete this.users[id];
  }

  startTimer(id) {
    this.timers[id] = setTimeout(() => {
      const checkTime = this.findTimeSlot(id);
      if (checkTime.bookedBy === "EMPTY") {
        console.log("Caneceling the reservation");
        checkTime.reservedByID = null;
        this.TimeSlots[id] = checkTime;
        const canceled = this.getTimeSlots();
        this.stopTimer(id);
        this.io.emit("updateTimes", canceled);
      }
    }, 10000);
  }

  stopTimer(id) {
    clearTimeout(this.timers[id]);
  }

  async loadTimeSlots() {
    const sql = await db.prepare("SELECT * FROM TimeSlots");
    const TimeSlots = await sql.all();
    TimeSlots.forEach(async (elem) => {
      const newTimeSlot = new TimeSlot(
        elem.id,
        elem.time,
        elem.room,
        elem.assistant,
        elem.assistantID,
        elem.bookedBy,
        elem.reservedBy,
        elem.bookedByID,
        elem.reservedByID
      );
      this.TimeSlots[newTimeSlot.id] = newTimeSlot;
      const sql2 = await db.prepare(
        "UPDATE TimeSlots SET id = ? WHERE time = ? AND room = ?"
      );
      await sql2.run(newTimeSlot.id, elem.time, elem.room);
    });
  }

  /**
   * Return the user object with the matching id.
   * @param {String} id - An unique identifier for the user session.
   * @returns {User}
   */
  findUserById(id) {
    return this.users[id];
  }

  /**
   * Join a specified room.
   * @param {String} room
   * @param {String} socketID
   * @returns {void}
   */
  join(socketId, room) {
    this.io.in(socketId).socketsJoin(room);
  }
}

export default new Model();
