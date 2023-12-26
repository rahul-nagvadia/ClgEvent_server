const mongoose = require('mongoose');
const schema = mongoose.Schema;
const collageSchema = require('./collageSchema');
const clg = mongoose.model('clg', collageSchema);

const clgOrgSchema = new schema({
    clg : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clg',
    },
    year: {
        type: Number,
        required: true,
    },
    winner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clg',
    },
    
});


module.exports = clgOrgSchema;
