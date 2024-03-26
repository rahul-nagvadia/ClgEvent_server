const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const collageSchema = require("../../models/collageSchema"); // Replace with your actual schema path
const Clg = mongoose.model("Clg", collageSchema);
const Event = require("../../models/eventSchema");
const event = mongoose.model("event", Event);
const player = require("../../models/playerSchema");
const Player = mongoose.model("Player", player);
const matchSchema = require("../../models/matchSchema");
const Match = mongoose.model("Match", matchSchema);

router.get("/getParticipatedclgNotScheduled/:eventId", async (req, res) => {
    const eventId = req.params.eventId;

    try {
        const matches = await Match.find({ event: eventId }).select("clg1 clg2");

        const participatedClgIds = matches.reduce((acc, match) => {
            if (match.clg1) acc.push(match.clg1);
            if (match.clg2) acc.push(match.clg2);
            return acc;
        }, []);

        const participants = await Player.find({ event: eventId }).select("clg");

        const collegeIds = participants.map((participant) => participant.clg);

        const participatingColleges = await Clg.find({
            _id: { $in: collegeIds, $nin: participatedClgIds },
        });

        return res.status(200).json({ participatingColleges });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get("/getClgsParticipated/:eventId/:round", async (req, res) => {
    const { eventId, round } = req.params;
    // console.log(eventId)
    // console.log(round)
    try {

        if (round == 1) {
            const matches = await Match.find({ event: eventId, }).select("clg1 clg2");

            const participatedClgIds = matches.reduce((acc, match) => {
                if (match.clg1) acc.push(match.clg1);
                if (match.clg2) acc.push(match.clg2);
                return acc;
            }, []);

            const participants = await Player.find({ event: eventId }).select("clg");

            const collegeIds = participants.map((participant) => participant.clg);

            const participatingColleges = await Clg.find({
                _id: { $in: collegeIds, $nin: participatedClgIds },
            });
            res.json({ success: true, clgs: participatingColleges });
        }
        else {
            const matches = await Match.find({ event: eventId, round: (round - 1) }).select("winner");
            // console.log(matches)
            const winners = matches.map((match) => match.winner);
            const partClg = await Clg.find({
                _id: { $in: winners },
            })
            res.json({ success: true, clgs: partClg });
        }



    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post("/schedulematches", async (req, res) => {
    try {
        const schedule = req.body;

        const match = new Match({
            clg1: schedule.clg1,
            clg2: schedule.clg2,
            event: schedule.event,
            match_date: schedule.matchDate,
            time: schedule.time,
            round: schedule.round
        });
        await match.save();
        return res.status(200).json({ msg: "Hello" });
    } catch {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post("/getScheduledEvents", async (req, res) => {
    try {
        const matches = await Match.find({ event: { $exists: true } }, "event");

        // Extract unique event IDs from the matches
        const eventIds = matches.map((match) => match.event);

        // Retrieve all events using the event IDs
        const events = await event.find({ _id: { $in: eventIds } });

        res.json({ events });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;