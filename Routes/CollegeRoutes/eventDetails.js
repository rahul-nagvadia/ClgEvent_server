const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const festOrganizerSchema = require("../../models/festOrganizerSchema");
const Orgclg = mongoose.model("Orgclg", festOrganizerSchema);
const Event = require("../../models/eventSchema");
const event = mongoose.model("event", Event);


router.post("/addEvent", async (req, res) => {
    try {
        const newEvent = new event(req.body);
        await newEvent.save();

        res.status(201).json({ message: "Event added successfully" });
    } catch (error) {
        console.error("Error adding event:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/getAllEvents", async (req, res) => {
    try {
        const events = await event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post("/getAllCurryearEvents", async (req, res) => {
    try {
        const curr_year = new Date().getFullYear();
        const clgg = await Orgclg.findOne({ year: curr_year });
        const events = await event.find({ clg: clgg.clg });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/getEventDetails/:eventId", async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const foundEvent = await event.findById(eventId);
        res.json(foundEvent);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/getEventHistDetails", async (req, res) => {
    try {
        const curr_year = new Date().getFullYear();
        const hist = await Orgclg.find({ year: { $lt: curr_year } });
        if (hist) {
            res.status(200).json(hist);
        } else {
            res.status(100);
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
