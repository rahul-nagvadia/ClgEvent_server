const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const mongoose = require("mongoose");
const collageSchema = require("../models/collageSchema"); // Replace with your actual schema path
const Clg = mongoose.model("Clg", collageSchema);
const adminSchema = require("../models/adminSchema");
const Admin = mongoose.model("Admin", adminSchema);

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

    const newClg = new Clg({
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
          id: newUser._id,
          username: newUser.username,
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
      let admin = false;
      if(username === "admin" && password === "admin"){
        admin = true;
      }
      console.log(admin);
  
      if (!clg && !admin) {
        console.log("No");
        return res.status(401).json({ error: "Incorrect Username or Password" });
      } else if (clg) {
        const passwordMatch = await bcrypt.compare(password, clg.password);
        if (!passwordMatch) {
          return res
            .status(401)
            .json({ error: "Incorrect Username or Password" });
        }
        const payload = {
          user: {
            id: user._id,
            username: user.username,
          },
        };
        const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
  
        res.cookie("token", token, { httpOnly: true });
        return res.status(200).json({ msg: "Login Successful", token });
      } else {
        console.log("Admin");
        if (password === "admin") {
          
        
        // const payload = {
        //   admin: {
        //     username: "admin",
        //   },
        // };
          
        // const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
        
        console.log("Hello"); 
        // res.cookie("token", token, { httpOnly: true });
        return res.status(201).json({ msg: "Login Successful"   });
        }
        else{
            return res
            .status(401)
            .json({ error: "Incorrect Username or Password" });
        }
      }
    } catch (error) {
  
      return res.status(401).json({ error: "Login Failed" });
    }
  });

module.exports = router;
