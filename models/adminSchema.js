const mongoose = require('mongoose');
const schema = mongoose.Schema;


const admindchema = new schema({
   username : String,
   password : String,
   email : String
});


module.exports = admindchema;
