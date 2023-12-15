const mongoose = require('mongoose');
const schema = mongoose.schema;
const collageSchema = require('./collageSchema');
const clg = mongoose.model('clg', collageSchema);
const eventSchema = require('./eventSchema');
const event = mongoose.model('event', eventSchema);

const playerSchema = new schema({
    name : String,
    email : String,
    mobile_no : String,
    clg: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clg',
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
    }
 });
 
 
 module.exports = playerSchema;