import { v4 as uuidv4 } from "uuid";

/**
 * @class TimeSlot
 */
class TimeSlot {
  constructor(
    id,
    time,
    room,
    assistant,
    assistantID,
    bookedBy = "EMPTY",
    reservedBy = "EMPTY",
    bookedByID = null,
    reservedByID = null
  ) {
    this.time = time;
    if (id === null) {
      this.id = uuidv4();
    } else {
      this.id = id;
    }
    this.bookedByID = bookedByID;
    this.bookedBy = bookedBy;
    this.reservedByID = reservedByID;
    this.reservedBy = reservedBy;
    this.assistant = assistant;
    this.assistantID = assistantID;
    this.room = room;
  }

  /**
   * Add a User.
   * @param {User} user - The assistant to add.
   * @returns {void}
   */
  addUser(user) {
    this.bookedBy = user.name;
  }
}

export default TimeSlot;
