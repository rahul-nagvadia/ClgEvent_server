const mongoose = require('mongoose');
const schema = mongoose.Schema;
const collageSchema = require('./collageSchema');
const clg = mongoose.model('clg', collageSchema);
const eventSchema = require('./eventSchema');
const event = mongoose.model('event', eventSchema);

const playerSchema = new schema({
    clg: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clg',
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
    },
    players: [{
        name: String,
        mobileno: String,
    }]
 });
 
 
 module.exports = playerSchema;