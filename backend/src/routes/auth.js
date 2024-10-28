import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import User from "../models/user.js";
import verifyToken from "../middleware/auth.js";
import { customValidate } from "../middleware/validation.js";

const auth = Router();

auth.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Email must be a valid email address")
      .isLength({ max: 50 })
      .withMessage("Email must be at most 50 characters long")
      .notEmpty()
      .withMessage("Email is required"),

    body("password")
      .isString()
      .withMessage("Password must be a string")
      .isLength({ min: 8, max: 16 })
      .withMessage("Password must be between 8 and 16 characters long")
      .notEmpty()
      .withMessage("Password is required"),
  ],
  customValidate,
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).send({ message: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send({ message: "Invalid Credentials" });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
      });

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 86400000,
      });

      res.status(200).send({ userId: user._id });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

auth.get("/validate-token", verifyToken, (req, res) => {
  res.status(200).send({ userId: req.userId });
});

auth.post("/logout", (req, res) => {
  res.cookie("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    expires: new Date(0),
  });

  res.status(200).send({ message: "Signed out successfully" });
});

export default auth;
