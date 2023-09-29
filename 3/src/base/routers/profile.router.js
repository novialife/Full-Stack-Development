import { Router } from "express";
import { readFile, resolvePublicPath } from "../util.js";
import sessionManager from "../sessionManager.js";

const privateRouter = Router();

privateRouter.get("/", async (req, res) => {
  let username = "";
  if (sessionManager.username !== undefined) {
    username = sessionManager.username;
  }

  const htmlDoc = (await readFile(resolvePublicPath("index.html"))).replace(
    "$username$",
    username
  );

  res.status(200).send(htmlDoc);
});

export default {
  privateRouter,
};
