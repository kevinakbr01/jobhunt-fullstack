const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { CustomResponse } = require("../utils/customResponse");

// Menangani proses registrasi
async function register(req, res, next) {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return res.status(409).json(new CustomResponse("Email sudah terdaftar!"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json(
      new CustomResponse("Registrasi berhasil.", {
        id: userId,
        name,
        email,
        role,
      }),
    );
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    // Cari pengguna berdasarkan email
    const user = await User.findByEmail(email);

    if (!user) {
      return res
        .status(401)
        .json(new CustomResponse("Email atau password salah!"));
    }

    // Cocokkan password dengan hash di database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json(new CustomResponse("Email atau password salah!"));
    }

    // Buat JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      },
    );

    return res.status(200).json(
      new CustomResponse("Login berhasil.", {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }),
    );
  } catch (error) {
    next(error);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json(new CustomResponse("User tidak ditemukan."));
    }

    return res
      .status(200)
      .json(new CustomResponse("Data user berhasil diambil.", user));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe,
};
