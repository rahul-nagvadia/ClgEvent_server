const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const collageSchema = require("../../models/collageSchema"); // Replace with your actual schema path
const Clg = mongoose.model("Clg", collageSchema);
const Event = require("../../models/eventSchema");
const event = mongoose.model("event", Event);
const matchSchema = require("../../models/matchSchema");
const Match = mongoose.model("Match", matchSchema);
const clgStatSchema = require("../../models/clgStatSchema");
const ClgStat = mongoose.model("ClgStat", clgStatSchema);
const axios = require("axios");

router.post("/getMatches/:eventId", async (req, res) => {
    try {
        const eventId = req.params.eventId;
        // console.log(eventId);

        const matches = await Match.find({ event: eventId });

        // Use Promise.all to wait for all asynchronous operations to complete
        const matchesWithDetails = await Promise.all(
            matches.map(async (match) => {
                const eventName = await event.findById(match.event);
                const clg1 = await Clg.findById(match.clg1);
                const clg2 = await Clg.findById(match.clg2);
                let winn = "";

                if (match.winner) {
                    winn = await Clg.findById(match.winner);
                }

                return {
                    eventName: eventName.event_name,
                    clg1: clg1,
                    clg2: clg2,
                    id: match._id,
                    match_date: match.match_date,
                    time: match.time,
                    winner: winn.clg_name,
                    round: match.round
                };
            })
        );

        // console.log(matchesWithDetails);
        res.json({ matches: matchesWithDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/matchWinner/:eventId/:index", async (req, res) => {
    try {
        const index = req.params.index;
        const { clg } = req.body; // Assuming clgId is a unique identifier like the clg._id
        const eventId = req.params.eventId;

        const matches = await Match.find({ event: eventId });

        // Make sure the index is within bounds
        if (index >= 0 && index < matches.length) {
            // Determine the winner based on the clgId
            let winner;
            if (clg.toString() === matches[index].clg1.toString()) {
                winner = matches[index].clg1;
                losser = matches[index].clg2;
            } else if (clg.toString() === matches[index].clg2.toString()) {
                winner = matches[index].clg2;
                losser = matches[index].clg1;
            }

            // Update the winner property for the specific match
            // matches[index].winner = winner;
            const match = new Match({
                _id: matches[index]._id,
                clg1: matches[index].clg1,
                clg2: matches[index].clg2,
                event: matches[index].event,
                match_date: matches[index].match_date,
                time: matches[index].time,
                winner: winner,
            });


            //  for winner
            const clgstatexist1 = await ClgStat.findOne({
                clg: winner
                
            });
            if (clgstatexist1) {
                clgstatexist1.wins = clgstatexist1.wins + 1;
                clgstatexist1.total_matches = clgstatexist1.total_matches + 1;
                await ClgStat.findByIdAndUpdate({_id : clgstatexist1._id}, clgstatexist1);
            } else {
                const response1 = await axios.post(
                    "http://localhost:5000/clg/getOrganizeCollege"
                );
                const collegeInfo1 = response1.data.clg;
                const clgstat1 = new ClgStat({
                    clg: winner,
                    event: matches[index].event,
                    wins: 1,
                    loses: 0,
                    total_matches: 1,
                    org_clg: collegeInfo1._id,
                });

                await clgstat1.save();
            }

            //for losser

            const clgstatexist2 = await ClgStat.findOne({
                clg: losser
            });
            if (clgstatexist2) {
                clgstatexist2.loses = clgstatexist2.loses + 1;
                clgstatexist2.total_matches = clgstatexist2.total_matches + 1;
                await ClgStat.findByIdAndUpdate({_id : clgstatexist2._id}, clgstatexist2);
            } else {
                const response2 = await axios.post(
                    "http://localhost:5000/clg/getOrganizeCollege"
                );
                const collegeInfo2 = response2.data.clg;
                const clgstat2 = new ClgStat({
                    clg: losser,
                    event: matches[index].event,
                    loses: 1,
                    wins: 0,
                    total_matches: 1,
                    org_clg: collegeInfo2._id,
                });

                await clgstat2.save();
            }

            await Match.findOneAndUpdate({ _id: matches[index]._id }, match)
                .then(() => {
                    res.json({ success: true });
                })
                .catch((e) => {
                    console.log(e);
                    res.json({ success: false });
                });
        } else {
            res.json({ success: false, error: "Index out of bounds" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
