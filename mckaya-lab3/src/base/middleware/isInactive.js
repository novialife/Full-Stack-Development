import sessionManager from "../sessionManager.js";
import db from "../database.js";

const isInactive = async (req, res, next) => {
  if (Math.abs(sessionManager.time - Date.now()) > 10 * 1000) {
    let cookies = req.headers.cookie;
    if (req.headers.cookie !== undefined) {
      cookies = req.headers.cookie.replace("session-id=", "");
    }
    sessionManager.deleteSession(cookies);
    sessionManager.authorized = false;
    sessionManager.username = undefined;
    res.clearCookie("session-id");
    const deleteCookie = await db.prepare(
      "UPDATE Users SET cookie = null WHERE cookie = ?"
    );
    await deleteCookie.run(cookies);
    res.redirect("/login?error=Session%20Expired");
  } else {
    sessionManager.time = Date.now();
    next();
  }
};

export default isInactive;
