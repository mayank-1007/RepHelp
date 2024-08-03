const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;

// Mock database
let users = {};
let otpStorage = {};

app.use(bodyParser.json());

app.post("/api/create-user", (req, res) => {
  const { name, email, phone } = req.body;
  const userId = Math.random().toString(36).substring(7); // Mock user ID
  users[userId] = { name, email, phone };
  res.send({ $id: userId });
});

app.post("/api/send-otp", (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  otpStorage[phone] = otp;
  console.log(`OTP for ${phone}: ${otp}`); // In real implementation, send OTP via SMS
  res.send({ success: true });
});

app.post("/api/verify-otp", (req, res) => {
  const { userId, otp } = req.body;
  const user = users[userId];
  if (user && otpStorage[user.phone] === otp) {
    delete otpStorage[user.phone]; // OTP verified, remove it from storage
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
