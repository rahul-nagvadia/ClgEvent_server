const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const collageSchema = require("../models/collageSchema");
const Clg = mongoose.model("Clg", collageSchema);
const adminSchema = require("../models/adminSchema");
const Admin = mongoose.model("Admin", adminSchema);
const requestSchema = require("../models/requestSchema");
const Req = mongoose.model("Req", requestSchema);
const festOrganizerSchema = require("../models/festOrganizerSchema");
const Orgclg = mongoose.model("Orgclg", festOrganizerSchema);

router.post("/getrequests", async (req, res) => {
  try {
    const requests = await Req.find();
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/acceptRequest/:id", async (req, res) => {
  const requestId = req.params.id;
  console.log(requestId);
  try {
    const request = await Req.findById(requestId);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    const newClg = new Clg({
      username: request.username,
      password: request.password,
      clg_name: request.clg_name,
      city: request.city,
      email: request.email,
      mobile_no: request.mobile_no,
    });

    await newClg.save();
    await Req.findByIdAndDelete(requestId);
    res.json({ message: "Request accepted and stored in Clg schema" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/declineRequest/:id", async (req, res) => {
  const requestId = req.params.id;
  console.log(requestId);
  try {
    await Req.findByIdAndDelete(requestId);
    res.json({ message: "Request declined" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/getOrganizingCollege/:year", async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const organizingclg = await Orgclg.findOne({ year: year }).populate(
      "clg",
      "clg_name"
    );
    if (organizingclg) {
      res.status(200).json({ organizingclg });
    } else {
      res
        .status(404)
        .json({
          message: "No college is organizing an event for the current year",
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/organizeEvent/:clgid", async (req, res) => {
  try {
    const clg_id = req.params.clgid;
    const org_clg = await Clg.findById(clg_id);
    const curr_year = new Date().getFullYear();
    const organizingclg = new Orgclg({
      clg: org_clg._id,
      year: curr_year,
    });

    await organizingclg.save();
    res.status(200).json({ organizingclg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ... (existing imports)

router.post("/deleteOrganizingCollege/:year", async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const deletedOrganizingCollege = await Orgclg.findOneAndDelete({
      year: year,
    });

    if (deletedOrganizingCollege) {
      res
        .status(200)
        .json({ message: "Organizing college deleted successfully" });
    } else {
      res
        .status(404)
        .json({
          message: "No organizing college found for the specified year",
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;


