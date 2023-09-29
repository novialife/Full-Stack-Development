import sessionManager from "../sessionManager.js";

const requireAuth = (req, res, next) => {
  if (req.path === "/" || req.path === "/logout") {
    if (sessionManager.authorized) {
      return next();
    }
    return res.redirect("/login");
  }
  return next();
};
export default requireAuth;
