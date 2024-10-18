import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register new user
export const registerUser = async (req, res) => {
  try {
    // Check if password exists
    if (!req.body.password) {
      return res.status(400).json({ message: "Password is required!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPass;

    const newUser = new UserModel(req.body);
    const { username } = req.body;

    // Check if user already exists
    const oldUser = await UserModel.findOne({ username });
    if (oldUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Save new user
    const user = await newUser.save();

    // Generate token
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWTKEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ user, token });
  } catch (error) {
    console.error("Error during user registration:", error.message);
    res.status(500).json({ message: "Registration failed, please try again." });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if username exists
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check password validity
    const validity = await bcrypt.compare(password, user.password);
    if (!validity) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    // Generate token on successful login
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWTKEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ user, token });
  } catch (err) {
    console.error("Error during user login:", err.message);
    res.status(500).json({ message: "Login failed, please try again later." });
  }
};
