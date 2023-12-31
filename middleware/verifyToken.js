import jwt from "jsonwebtoken";
import { JWTSCECRETKEY } from "../config/index.js";

export const verifyToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      res.status(401).json({
        status: false,
        message: "Unauthorized User",
      });
    } else {
      token = token.split(" ")[1];
      let user = jwt.verify(token, JWTSCECRETKEY);
      req.userId = user._id;
    }
    next();
  } catch (error) {
    res.status(401).json({
      status: false,
      message: "Unauthorized User",
    });
  }
};
