import { v4 as uuidv4 } from "uuid";

/**
 * @class User
 */
class User {
  constructor(name) {
    this.name = name;
    this.currentRoom = null;
    this.isAdmin = false;
    this.id = uuidv4();
  }

  /**
   * Join a specified room.
   * @param {Room} room - The room to join.
   * @returns {void}
   */
  joinRoom(room) {
    this.currentRoom = room;
  }
}

export default User;
