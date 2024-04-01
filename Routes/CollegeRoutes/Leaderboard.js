const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const clgStatSchema = require("../../models/clgStatSchema");
const ClgStat = mongoose.model("ClgStat", clgStatSchema);
const festOrganizerSchema = require("../../models/festOrganizerSchema");
const Orgclg = mongoose.model("Orgclg", festOrganizerSchema);
const collageSchema = require("../../models/collageSchema"); // Replace with your actual schema path
const Clg = mongoose.model("Clg", collageSchema);

async function getLeaderboard(orgclgid) {
  try {
    // Fetch leaderboard data
    let leaderboard = await ClgStat.find({ org_clg: orgclgid })
      .populate("clg", "clg_name")
      .sort({ wins: -1 });

    // Sum wins, loses, and total_matches for each unique clg_name
    const clgStatsMap = new Map();
    leaderboard.forEach((entry) => {
      const clgName = entry.clg.clg_name;
      const wins = entry.wins;
      const loses = entry.loses;
      const totalMatches = entry.total_matches;
      if (clgStatsMap.has(clgName)) {
        clgStatsMap.get(clgName).wins += wins;
        clgStatsMap.get(clgName).loses += loses;
        clgStatsMap.get(clgName).totalMatches += totalMatches;
      } else {
        clgStatsMap.set(clgName, { wins, loses, totalMatches });
      }
    });

    // Create a new leaderboard array with unique colleges and summed wins, loses, and total_matches
    leaderboard = Array.from(clgStatsMap, ([clgName, stats]) => ({
      clg: { clg_name: clgName },
      wins: stats.wins,
      loses: stats.loses,
      total_matches: stats.totalMatches,
    }));

    return leaderboard;
  } catch (error) {
    console.error("Error fetching leaderboard:", error.message);
    throw error;
  }
}

router.post("/leaderboard", async (req, res) => {
  try {
    let orgclg;

    const response = await fetch(
      "http://localhost:5000/clg/getOrganizeCollege",
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data.clg) {
      orgclg = data.clg;
    } else {
      console.error("No college data found in the response:", data);
    }

    const leaderboard = await getLeaderboard(orgclg._id);
    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/declarewinner/:mostWinsCollegeId", async (req, res) => {
  try {
    const winclgid = req.params.mostWinsCollegeId;
    const curryear = new Date().getFullYear();
    // console.log(winclgid)
    // Find and update the document
    const clgid = await Clg.findOne({clg_name : winclgid});
    // console.log(clgid)
    await Orgclg.findOneAndUpdate(
      { year: curryear },
      { $set: { winner: clgid._id } },
      { new: true }
    ).then(() => {
      res.json({ success: true });
  })
  .catch((e) => {
      console.log(e);
      res.json({ success: false });
  });
  }catch(e){
    console.log(e);
  }
});


router.get("/getWinner", async (req, res) => {
  try {
    
    const curryear = new Date().getFullYear();
    // console.log(winclgid)
    // Find and update the document
    const t = await Orgclg.findOne({year : curryear});
    console.log("t" + t)
    const winn = await Clg.findOne({_id : t.winner})
    console.log(winn)
    res.json({winner : winn});
    
  }catch(e){
    console.log(e);
  }
});


module.exports = router;
