/**
 * @class Assistant
 */
class Assistant {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.isBooked = false;
    this.bookedBy = null;
  }

  /**
   * Books the assistant.
   * @param {User} user - The user that books.
   * @returns {void}
   */
  bookAssistant(user) {
    this.isBooked = true;
    this.bookedBy = user;
  }
}

export default Assistant;
