import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = "perpustakaan2025";

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashPassword,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(401).json({
        message: "Password salah",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};