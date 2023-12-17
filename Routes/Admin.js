const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const collageSchema = require("../models/collageSchema"); // Replace with your actual schema path
const Clg = mongoose.model("Clg", collageSchema);
const adminSchema = require("../models/adminSchema");
const Admin = mongoose.model("Admin", adminSchema);
const requestSchema = require("../models/requestSchema"); // Replace with your actual schema path
const Req = mongoose.model("Req", requestSchema);

router.post('/getrequests', async (req,res)=>{
    try {
        const requests = await Req.find();
        res.json(requests);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

router.post('/acceptRequest/:id', async (req, res) => {
    const requestId = req.params.id;
    console.log(requestId);
    try {
      const request = await Req.findById(requestId);
  
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }
  
      // Create a new Clg using the data from the request
      const newClg = new Clg({
        username: request.username,
        password: request.password,
        clg_name: request.clg_name,
        city: request.city,
        email: request.email,
        mobile_no: request.mobile_no,
      });
  
      // Save the new Clg
      await newClg.save();
      await Req.findByIdAndDelete(requestId);
      res.json({ message: 'Request accepted and stored in Clg schema' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.delete('/declineRequest/:id', async (req, res) => {
    const requestId = req.params.id;
    console.log(requestId);
    try {
      await Req.findByIdAndDelete(requestId);
      res.json({ message: 'Request declined' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  module.exports = router;