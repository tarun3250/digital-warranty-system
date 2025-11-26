const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPass = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPass
    });

    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      "SECRET_KEY_123",
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
