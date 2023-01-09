import { Router } from "express";
import multer from "multer";
import fs from "fs";
import model from "../model.js";
import db from "../database.js";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./public/data/uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`); // Appending .jpg
  },
});

const upload = multer({ storage });

const router = Router();

async function getAllAds() {
  const sql = await db.prepare("SELECT * FROM Ads");
  const ads = await sql.all();
  return ads;
}

async function findAdById(adId) {
  const sql = await db.prepare("SELECT * FROM Ads WHERE id = ?");
  const ad = await sql.get(adId);
  return ad;
}

router.post(
  "/profile/uploadImage",
  upload.single("uploaded-file"),
  async (req, res) => {
    const { id } = req.session;
    const user = model.findUserById(id);

    if (user === undefined || !user.isAuth) {
      res.status(403).end();
      return;
    }

    await user.makeAd(req.body.title, req.body.body, req.body.price, req.file);

    model.io.emit("updateUserAds", await user.getAds());
    const allAds = await getAllAds();
    model.io.emit("updateAllAds", allAds);
    res.status(200).end();
  }
);

router.get("/uploads/:filename", (req, res) => {
  const { filename } = req.params;
  res.status(200).sendFile(`./public/data/uploads/${filename}`, { root: "./" });
});

router.get("/userImages", async (req, res) => {
  const { id } = req.session;
  const user = model.findUserById(id);

  if (user === undefined || !user.isAuth) {
    res.status(403).end();
    return;
  }
  res.status(200).json({ Ads: await user.getAds() });
});

router.get("/allImages", async (req, res) => {
  res.status(200).json({ Ads: await getAllAds() });
});

router.post("/delete/:id", async (req, res) => {
  const { id } = req.session;
  const { adId } = req.body;
  const user = model.findUserById(id);

  const theAd = await findAdById(adId);
  
  if (user === undefined || !user.isAuth || user.name !== theAd.username) {
    res.status(403).end();
    return;
  }

  const sql = await db.prepare("DELETE FROM Ads WHERE id = ?");
  await sql.run(adId);

  fs.unlink(`./public/data/uploads/${theAd.filename}`, (err) => {
    if (err) {
      console.log(err);
    }
  });

  model.io.emit("updateUserAds", await user.getAds());
  model.io.emit("updateAllAds", await getAllAds());
  res.status(200).end();
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  res.status(200).json({ ad: await findAdById(id) });
});

export default { router };
