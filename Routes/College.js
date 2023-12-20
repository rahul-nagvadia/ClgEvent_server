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
const festOrganizerSchema = require("../models/festOrganizerSchema");
const Orgclg = mongoose.model("Orgclg", festOrganizerSchema);
const Event = require('../models/eventSchema');
const event = mongoose.model("event", Event);
const secretKey = "THISISMYSECURITYKEYWHICHICANTGIVEYOU";

router.post("/register", async (req, res) => {
  const { username, password, clgName, city, email, mobileNo } = req.body;

  try {
    const existingUser = await Clg.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with the same email or username already exists" });
    }

    const existingCollage = await Clg.findOne({ clg_name: clgName });
    if (existingCollage) {
      return res
        .status(402)
        .json({ error: "This College is already registered" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newClg = new Req({
      username,
      password: hashedPassword,
      clg_name: clgName,
      city,
      email,
      mobile_no: mobileNo,
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
    const admin = await Admin.findOne({ username: username });
    const req = await Req.findOne({ username: username });

    if (req) {
      return res
        .status(402)
        .json({ msg: "You Still Under Verification Process" });
    }

    if (!clg && !admin) {
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
          id: clg._id,
          username: clg.username,
        },
      };
      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
      res.cookie("token", token, { httpOnly: true });
      return res.status(200).json({ msg: "Login Successful", token });
    } else {
      let passwordMatch = false;
      if (admin.password === password) {
        passwordMatch = true;
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

router.post("/getAllColleges", async (req, res) => {
  try {
    const colleges = await Clg.find();
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/getOrganizeCollege", async (req, res) => {
  try {
    const curr_year = new Date().getFullYear();
    const clg = await Orgclg.findOne({ year: curr_year });

    if (!clg) {
      return res.status(404).json({ error: "No college found" });
    }

    const orgclg = await Clg.findById(clg.clg);
    console.log(clg);
    return res.json({ clg: orgclg });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/addEvent", async (req, res) => {
  try {
    const newEvent = new event(req.body);
    await newEvent.save();

    res.status(201).json({ message: 'Event added successfully' });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post("/getAllEvents", async (req, res) => {
  try {
    const events = await event.find();
    console.log(events);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/getEventDetails/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const foundEvent = await event.findById(eventId);
    console.log(foundEvent);
    res.json(foundEvent);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
