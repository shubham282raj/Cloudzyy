import { Router } from "express";
import { body } from "express-validator";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth.js";
import { customValidate } from "../middleware/validation.js";

const user = Router();

user.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      res.cookie("auth_token", "", {
        expires: new Date(0),
      });
      return res.status(404).send({ message: "Forced Logout: User Not Found" });
    }

    return res.status(200).send({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Something went wrong",
    });
  }
});

user.post(
  "/register",
  [
    body("name")
      .isString()
      .withMessage("Name must be a string")
      .isLength({ max: 50 })
      .withMessage("Name must be at most 50 characters long")
      .notEmpty()
      .withMessage("Name is required"),

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

    body("githubRepo")
      .isString()
      .withMessage("GitHub Repository must be a string")
      .notEmpty()
      .withMessage("GitHub Repository is required"),

    body("githubRepoOwner")
      .isString()
      .withMessage("GitHub Repository Owner must be a string")
      .notEmpty()
      .withMessage("GitHub Repository Owner is required"),

    body("githubToken")
      .isString()
      .withMessage("GitHub Token must be a string")
      .notEmpty()
      .withMessage("GitHub Token is required"),
  ],
  customValidate,
  async (req, res) => {
    try {
      const userCheckEmail = await User.findOne({
        email: req.body.email,
      });

      if (userCheckEmail) {
        return res.status(400).send({ message: "Email already exists" });
      }

      const user = new User(req.body);

      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d",
      });

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 86400000,
      });

      res.status(200).send({ message: "User registered successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Something went wrong",
      });
    }
  }
);

export default user;
