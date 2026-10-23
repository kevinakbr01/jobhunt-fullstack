const express = require("express");
const router = express.Router();

const { register, login, getMe } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const {
  registerValidation,
  loginValidation,
} = require("../middleware/authenticationValidator/authValidation");

const validationResultHandler = require("../middleware/resultHandlerValidator/validationResultHandler");

router.post("/register", registerValidation, validationResultHandler, register);
router.post("/login", loginValidation, validationResultHandler, login);
router.get("/me", authMiddleware, getMe);

module.exports = router;
