const mongoose = require('mongoose');
const schema = mongoose.Schema;


const collageSchema = new schema({
   username : String,
   password : String,
   clg_name : String,
   city : String,
   email : String,
   mobile_no : String,
});


module.exports = collageSchema;
