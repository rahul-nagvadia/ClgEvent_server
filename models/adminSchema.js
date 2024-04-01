const mongoose = require('mongoose');
const schema = mongoose.Schema;


const adminSchema = new schema({
   username : String,
   password : String,
   email : String
});


//AK
module.exports = adminSchema;
