const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const mongoose = require("mongoose");
const collageSchema = require("../models/collageSchema"); // Replace with your actual schema path
const Clg = mongoose.model("Clg", collageSchema);
const adminSchema = require("../models/adminSchema");
const Admin = mongoose.model("Admin", adminSchema);
const requestSchema = require("../models/requestSchema"); // Replace with your actual schema path
const Req = mongoose.model("Req", requestSchema);
const secretKey = "THISISMYSECURITYKEYWHICHICANTGIVEYOU";

router.post("/register", async (req, res) => {
  const { username, password, clgName, city, email, mobileNo } = req.body;

  try {
    const existingUser = await Clg.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "User with the same email or username already exists" });
    }

    const existingCollage = await Clg.findOne({ clg_name: clgName });
    if (existingCollage) {
      return res.status(402).json({ error: "This College is already registered" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newClg = new Req({
      username,
      password: hashedPassword,
      clg_name: clgName,
      city,
      email,
      mobile_no: mobileNo
    });

    await newClg.save();
    const payload = {
        user: {
          id: newClg._id,
          username: newClg.username,
        },
      };
      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
  
      res.cookie("token", token, { httpOnly: true });
    return res.status(200).json({ msg: "Registration Successful" });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});




router.post("/login", async (req, res) => {
    const { username, password } = req.body;
  
    try {

      const clg = await Clg.findOne({ username: username });
      const admin = await Admin.findOne({username: username});
      const req = await Req.findOne({username: username});

      if(req){
        return res.status(402).json({ msg: "You Still Under Verification Process" });
      }
    
      if (!clg && !admin) {
        return res.status(401).json({ error: "Incorrect Username or Password" });
      }

      else if (clg) {
        const passwordMatch = await bcrypt.compare(password, clg.password);
        if (!passwordMatch) {
          return res
            .status(401)
            .json({ error: "Incorrect Username or Password" });
        }
        const payload = {
          user: {
            id: clg._id,
            username: clg.username,
          },
        };
        const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true });
        return res.status(200).json({ msg: "Login Successful", token });
      } 

      else {
        let passwordMatch = false;
        if(admin.password === password){
          passwordMatch=true;
        }
        if (!passwordMatch) {
          console.log("Heloo");
          return res
            .status(401)
            .json({ error: "Incorrect Username or Password" });
        }
        const payload = {
          admin: {
            id: admin._id,
            username: admin.username,
          },
        };
        const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true });
        return res.status(201).json({ msg: "Login Successful", token });
        }

    } catch (error) {
  
      return res.status(401).json({ error: "Login Failed" });
    }
  });

module.exports = router;
