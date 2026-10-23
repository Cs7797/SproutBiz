import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import User from "../models/userModel.js";
export const verifyUser = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token)
    return next(errorHandler(404, "you are not authorised,kindly login first"));
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return next(errorHandler(404, "invalid token"));
      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(404, "you are not login"));
  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) return next(errorHandler(404, "invalid token"));
      const data = await User.findById(user.id);
      if (data.isAdmin === true) {
        req.user = user;
        next();
      } else return next(errorHandler(404, "You are not an admin"));
    });
  } catch (error) {
    next(error);
  }
};
