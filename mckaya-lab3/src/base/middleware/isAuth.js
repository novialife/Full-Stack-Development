import sessionManager from "../sessionManager.js";

const isAuth = async (req, res, next) => {
  if (req.path === "/login" || req.path === "/registration") {
    if (sessionManager.authorized) {
      return res.redirect("/");
    }
  }
  return next();
};

export default isAuth;
