const mongoose = require('mongoose');

const SpinnerItemsSchema = mongoose.Schema({
    spinnerId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
        default: 'no-image.png'
    },
    color: {
        type: String,
        default: null
    },
    statistics: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('announceSpinnerItems', SpinnerItemsSchema);