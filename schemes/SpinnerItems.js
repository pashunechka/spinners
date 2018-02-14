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
    }
});

module.exports = mongoose.model('SpinnerItems', SpinnerItemsSchema);