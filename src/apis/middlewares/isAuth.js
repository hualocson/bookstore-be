export default function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res
      .status(401)
      .json({ success: false, error: { message: "Unauthorized" } });
  }
}
