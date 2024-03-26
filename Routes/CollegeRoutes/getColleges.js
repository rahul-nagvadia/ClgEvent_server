const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const collageSchema = require("../../models/collageSchema"); // Replace with your actual schema path
const Clg = mongoose.model("Clg", collageSchema);
const festOrganizerSchema = require("../../models/festOrganizerSchema");
const Orgclg = mongoose.model("Orgclg", festOrganizerSchema);


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
        return res.json({ clg: orgclg });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/getClgDetails/:userid", async (req, res) => {
    try {
        let userid = req.params.userid;
        // console.log(userid);
        const clg = await Clg.findById(userid);
        // console.log(clg)
        res.json({ clg: clg });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;