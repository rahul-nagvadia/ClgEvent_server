const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const collageSchema = require("../models/collageSchema");
const Clg = mongoose.model("Clg", collageSchema);

router.post("/register", async (req, res) => {

    const { username, password, clgName, city, email, mobileNo } = req.body;
    console.log(username)
    const existingUser = await Clg.findOne({ $or: [{ email }, { username },] });
    const existingcollage = await Clg.findOne({ clg_name: clgName });

    if (existingUser) {
        return res
            .status(400)
            .json({ error: "User with the same email or username already exists" });
    }

    if (existingcollage) {
        return res
            .status(402)
            .json({ error: "This Collage is already registered" });
    }

    const newClg = new Clg({
        username,
        password,
        clg_name: clgName,
        city,
        email,
        mobile_no: mobileNo
    });
    
    console.log(newClg);
    try {

        await newClg.save();
        //   alert("Welcome");
        return res.status(200).json({ msg: "Registration Successful" });
    } catch (error) {

        return res.status(401).json({ error: "Registration Failed" });
    }
});

module.exports = router;