import { v4 as uuidv4 } from "uuid";

/**
 * @class Ad
 */
class Ad {
  constructor(userID, title, body, price, image) {
    this.id = uuidv4();
    this.userID = userID;
    this.title = title;
    this.body = body;
    this.price = price;
    this.image = image; 
    }
}
export default Ad;
