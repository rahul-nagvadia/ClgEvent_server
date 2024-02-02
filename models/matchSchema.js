const mongoose = require('mongoose');
const schema = mongoose.Schema;
const eventSchema = require('./eventSchema');
const event = mongoose.model('event', eventSchema);
const collageSchema = require('./collageSchema');
const clg = mongoose.model('clg', collageSchema);

const matchSchema = new schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
    },
    match_date: Date, 
    time : String,
    clg1 : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clg',
    },
    clg2 : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clg',
    },
    winner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clg',
    },
    round : String
});


module.exports = matchSchema;
