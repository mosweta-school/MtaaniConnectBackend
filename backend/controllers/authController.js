import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { readDB, writeDB } from "../utils/db.js";
import { generateToken } from "../utils/generateToken.js";


// ======================================================
// REGISTER USER
// ======================================================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const db = readDB();

    // CHECK IF USER EXISTS
    const userExists = db.users.find(
      (user) => user.email === email
    );

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // PASSWORD VALIDATION
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const newUser = {
      id: nanoid(),
      name,
      email,
      password: hashedPassword,
      role: "user",
      isActive: "1",
      createdAt: new Date().toISOString(),
    };

    // SAVE USER
    db.users.push(newUser);
    writeDB(db);

    // RESPONSE
    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(newUser),
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};


// ======================================================
// LOGIN USER
// ======================================================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const db = readDB();

    // FIND USER
    const user = db.users.find(
      (u) => u.email === email
    );

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // CHECK IF ACTIVE
    if (user.isActive === "0") {
      return res.status(403).json({
        message: "Account disabled. Please contact admin at support@mtaaniconnect.com for more details.",
      });
    }

    // SUCCESS RESPONSE
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
      message: "Login failed",
      error: error.message,
    });
  }
};