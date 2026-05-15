// Handles what happens when requests come in.
//Register and login

import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import axios from "axios";

let users = [];

export const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {

    // GET USERS FROM db.json
    const { data: users } = await axios.get(
      "http://localhost:8000/users"
    );

    // CHECK IF USER EXISTS
    const userExists = users.find(
      (user) => user.email === email
    );

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // CHECK PASSWORD MATCH
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const user = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
      role: "user",
    };

    // SAVE TO db.json
    await axios.post(
      "http://localhost:8000/users",
      user
    );

    // RESPONSE
    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: users } = await axios.get(
      "http://localhost:8000/users"
    );

    const user = users.find(
      (user) => user.email === email
    );

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};