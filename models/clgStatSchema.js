const mongoose = require('mongoose');
const schema = mongoose.Schema;
const eventSchema = require('./eventSchema');
const event = mongoose.model('event', eventSchema);
const collageSchema = require('./collageSchema');
const clg = mongoose.model('clg', collageSchema);

const clgStatSchema = new schema({
    clg : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clg',
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
    },
    wins : Number,
    loses : Number,
    total_matches : Number,
    org_clg : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clg',
    }
});


module.exports = clgStatSchema;
