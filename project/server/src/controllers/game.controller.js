import { Router } from "express";
import model from "../model.js";
import multer from "multer";
import fs from "fs"


const upload = multer({ dest: './public/data/uploads/' });

const router = Router();

// Get the balance and match history
router.get("/profile", async (req, res) => {
  const { id, socketID } = req.session;
  const user = model.findUserById(id);
  console.log(user);



  // fs.readFile('./public/data/uploads/ae9bf1a5a480c5d5409b405294b2b12c', function(err, data) {
  //   if (err) throw err // Fail if the file can't be read.

  //   model.join(socketID, "Profile");
  //   res.status(200).end();
    
  // })
  
  model.join(socketID, "Profile");
  
  res.sendFile("C:/Users/Mervan/Documents/Onedrive/DD1389/mckaya-project/server/public/data/uploads/ae9bf1a5a480c5d5409b405294b2b12c");
});

// Get the current lobbies
router.get("/lobby", (req, res) => {
  const { id, socketID } = req.session;

  const user = model.findUserById(id);
  model.join(socketID, "Lobby");

  const Games = model.getGames();
  console.log(Games, "Current games in lobby");

  res.status(200).json({ Games });
});

// Add balance to the user
router.post("/profile/uploadImage", upload.single('uploaded-file'), async (req, res) => {

  const { id, socketID } = req.session;
  const user = model.findUserById(id);

  if (!user.isAuth) {
    res.status(403).end();
    return;
  }

  const newAd = model.makeAd(id, req.body.title, req.body.body, req.body.price, req.file);
  user.addAd(newAd.id, newAd);
  await model.addAdToDatabase(newAd);
  model.join(socketID, "Profile");
  model.io.to("Profile").emit("updateAds", user.ads);

  res.status(200).end();
});

router.post("/profile/delete", async (req, res) => {
  const { id, socketID } = req.session;
  const { adId } = req.body;
  const user = model.findUserById(id);

  if (!user.isAuth) {
    res.status(403).end();
    return;
  }

  user.deleteAd(adId);
  model.join(socketID, "Profile");
  model.io.to("Profile").emit("updateAds", user.ads);
  res.status(200).end();

});

// OKLART VAD JAG SKA GÖRA MED DENNA
router.get("/Game/:id", (req, res) => {
  const gameID = req.params.id;
  const { id, socketID } = req.session;
  const user = model.findUserById(id);
  if (model.findGameById(gameID).players.length >= 6){
    res.status(403).end();
    return;
  }

  let currGame = model.findGameById(gameID);
  currGame.players.push(user.name);
  const newGames = model.getGames();

  model.join(socketID, "Lobby");
  model.io.to("Lobby").emit("updateGames", newGames);
  res.status(200).end();
});

export default { router };
