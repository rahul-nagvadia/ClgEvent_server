const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const festOrganizerSchema = require("../../models/festOrganizerSchema");
const Orgclg = mongoose.model("Orgclg", festOrganizerSchema);
const Event = require("../../models/eventSchema");
const event = mongoose.model("event", Event);
const clgStatSchema = require("../../models/clgStatSchema");
const ClgStat = mongoose.model("ClgStat", clgStatSchema);

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
        const hist = await Orgclg.find({ winner: { $ne: null } })
            .populate('clg', 'clg_name') // Populate the 'clg' field with the 'clg_name' only
            .populate('winner', 'clg_name'); // Populate the 'winner' field with the 'clg_name' only
        if (hist && hist.length > 0) {
            res.status(200).json(hist);
        } else {
            res.status(404).json({ error: "No event history found" }); // Update status code to 404
        }
    } catch (error) {
        console.error("Error fetching event history:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

async function calculateTotalWins(clgId) {
    try {
      // Find all clg stats for the given college
      const clgStats = await ClgStat.find({ clg: clgId }).populate('event');
  
      // Create a map to store total wins for each event name
      const totalWinsMap = new Map();
  
      // Iterate over clg stats to calculate total wins for each event
      clgStats.forEach(stat => {
        const eventName = stat.event.event_name;
        const wins = stat.wins;
  
        if (totalWinsMap.has(eventName)) {
          // If event name exists in the map, add wins to existing total
          totalWinsMap.set(eventName, totalWinsMap.get(eventName) + wins);
        } else {
          // If event name doesn't exist in the map, initialize with wins
          totalWinsMap.set(eventName, wins);
        }
      });
  
      // Convert map to array of objects
      const totalWinsArray = Array.from(totalWinsMap, ([eventName, totalWins]) => ({ eventName, totalWins }));
  
      return totalWinsArray;
    } catch (error) {
      console.error('Error calculating total wins:', error);
      throw error;
    }
  }
  

router.post("/getTotalWinsForCollege/:collegeId", async (req, res) => {
    try {
        const collegeId = req.params.collegeId;

        // Calculate total wins for the given college
        const totalWins = await calculateTotalWins(collegeId);
        res.json(totalWins);
    } catch (error) {
        console.error("Error fetching total wins for college:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




module.exports = router;
