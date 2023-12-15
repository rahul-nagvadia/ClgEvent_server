const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const collageSchema = require("../models/collageSchema");
const Clg = mongoose.model("Clg", collageSchema);

router.post("/register", async (req, res) => {

    const { username, password, clg_name, city, email, mobile_no } = req.body;
  
    const existingUser = await Clg.findOne({ $or: [{ email }, { username }] });
  
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with the same email or username already exists" });
    }
  
    const newClg = new Clg({
      username, 
      password,
      clg_name, 
      city, 
      email, 
      mobile_no
    });
  
    try {
  
      await newClg.save();
      const payload = {
        user: {
          id: newClg._id,
          username: newUser.username,
        },
      };
      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
  
      res.cookie("token", token, { httpOnly: true });
      return res.status(200).json({ msg: "Registration Successful", token });
    } catch (error) {
  
      return res.status(401).json({ error: "Registration Failed" });
    }
  });

  module.exports = router;