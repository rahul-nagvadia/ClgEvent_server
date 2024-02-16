const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const clgStatSchema = require("../../models/clgStatSchema");
const ClgStat = mongoose.model("ClgStat", clgStatSchema);

async function getLeaderboard() {
    try {
      const leaderboard = await ClgStat
        .find()
        .populate('clg', 'clg_name') // Populate with the 'clg_name' field from 'collageSchema'
        .sort({ wins: -1 });
  
      return leaderboard;
    } catch (error) {
      console.error('Error fetching leaderboard:', error.message);
      throw error;
    }
  }
  
  router.post('/leaderboard', async (req, res) => {
    try {
      const leaderboard = await getLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
module.exports = router;