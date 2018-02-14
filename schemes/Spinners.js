const mongoose = require('mongoose');

const SpinnersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Spinners', SpinnersSchema);