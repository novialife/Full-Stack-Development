import User from "./models/User.model.js";
import Ad from "./models/Ad.model.js";
import db from "./database.js";

class Model {
  constructor() {
    this.users = {};
    this.ads = {};

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



  async addAdToDatabase(ad){
    console.log("ADDING THIS TO THE DATABASE:")
    console.log("The ad", ad)
    const sql = await db.prepare(
      "INSERT INTO Ads(id, userID, title, body, price, imagePath, imageMime) VALUES(?,?,?,?,?,?,?)"
    )
    await sql.run(ad.id, ad.userID, ad.title, ad.body, ad.price, ad.image.path, ad.image.mimetype);
  }



  /**
   * Create a booking with the given time.
   * @param {String} time - The time of the slot.
   * @param {String} room - The room of the slot.
   * @param {String} assistant - The assistant of the slot.
   * @returns {TimeSlot}
   */

  /**
   * Return all the TimeSlots.
   * @returns {Game[]}
   */


   makeAd(userID, title, body, price, image){
    const newAd = new Ad(userID, title, body, price, image);
    this.ads[newAd.id] = newAd;
    return newAd;
  }

  getAds() {
    return Object.values(this.ads);
  }

  deleteAd(id){
    delete this.ads[id];
  }

  findAdById(id) {
    return this.ads[id];
  }

  /**
   * Create a user with the given name.
   * @param {String} id - An unique identifier for the user session.
   * @param {String} name - The name of the user.
   * @param {boolean} admin - Is admin.

   * @returns {void}
   */
  createUser(id, name, country, city, postalcode, nr, auth) {
    const newUser = new User(id, name, country, city, postalcode, nr, auth);
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
