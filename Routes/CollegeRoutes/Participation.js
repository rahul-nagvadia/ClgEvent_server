const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const collageSchema = require("../../models/collageSchema"); // Replace with your actual schema path
const Clg = mongoose.model("Clg", collageSchema);
const player = require("../../models/playerSchema");
const Player = mongoose.model("Player", player);

router.post("/addParticipants", async (req, res) => {
    try {
        const { eventId, participants, userid } = req.body;

        const clg = await Player.find({ clg: userid, event: eventId });

        if (clg.length !== 0) {
            return res.status(400).json({ error: "Already Registered" });
        } else {
            const newPlayer = new Player({
                clg: userid,
                event: eventId,
                players: participants,
            });

            await newPlayer.save();

            return res
                .status(200)
                .json({ success: "Participant added successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/getParticipatedclg/:eventId", async (req, res) => {
    try {
        const { eventId } = req.params;
        console.log(eventId);
        const participants = await Player.find({ event: eventId }).select("clg");
        // Assuming participants is an array of objects, use map to extract clg values
        const collegeIds = participants.map((participant) => participant.clg);

        const participatingColleges = await Clg.find({ _id: { $in: collegeIds } });
        return res.status(200).json({ participatingColleges });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/getPlayers/:eventId/:clgId", async (req, res) => {
    try {
        const { eventId, clgId } = req.params;

        const players = await Player.find({ event: eventId, clg: clgId }).select(
            "players"
        );

        return res.status(200).json({ players });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
