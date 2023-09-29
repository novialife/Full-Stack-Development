import db from "../database.js";
import { v4 as uuidv4 } from "uuid";

/**
 * @class User
 */
class User {
  constructor(id, name, country, city, postalcode, nr, auth) {
    this.id = id;
    this.name = name;
    this.country = country;
    this.city = city;
    this.postalcode = postalcode;
    this.nr = nr;
    this.ads = {};
    this.isAuth = auth;
  }
  
  addAd(id, ad){
    this.ads[id] = ad;
  }

  deleteAd(adId){
    delete this.ads[adId];
  }
}
export default User;
