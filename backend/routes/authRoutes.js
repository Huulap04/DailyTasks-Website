const express = require("express");
const router = express.Router();

const { register, login } = require("../controller/authController");
const { validateLogin, validateRegister } = require("../middleware/validateRequest");

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
module.exports = router;
