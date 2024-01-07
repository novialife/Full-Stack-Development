import User from "./models/User.model.js";

class Model {
  constructor() {
    this.users = {};
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
   * Create a user with the given name.
   * @param {String} id - An unique identifier for the user session.
   * @param {String} name - The name of the user.
   * @param {boolean} admin - Is admin.

   * @returns {void}
   */
  createUser(id, username, country, city, postalcode, nr, auth) {
    const newUser = new User(id, username, country, city, postalcode, nr, auth);
    this.users[newUser.id] = newUser;
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
