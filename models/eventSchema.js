const mongoose = require('mongoose');
const schema = mongoose.Schema;
const collageSchema = require('./collageSchema');
const clg = mongoose.model('clg', collageSchema);

const eventSchema = new schema({
   event_name : String,
   players : Number,
   venue : String,
   event_desc : String,
   event_date : Date,
   reg_date : Date,
   img_url : String,
   clg: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'clg',
   },
});


module.exports = eventSchema;
