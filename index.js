const mongoose = require('mongoose');
const express = require('express');
const app = express();
const router = express.Router();
const portnumber = 5000;

const url = `mongodb+srv://harmongo1145:HarshAksharRahul@eventman.j0tzxsr.mongodb.net/interclg?retryWrites=true&w=majority`;

mongoose.connect(url)
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

app.listen(portnumber, () => {
  console.log("Application started on port number " + portnumber);
});

app.use((req, res,next)=>{
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next();
})

app.use(express.json())

app.use('/clg', require("../ClgEvent_server/Routes/Login"))
