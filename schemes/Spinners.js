const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SpinnersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        private: {
            type:  Boolean,
            required: true,
            default: false
        },
        passwordSpinner:{
            type: String,
            default: ''
        }
    }
});

SpinnersSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
};

SpinnersSchema.methods.validPassword = (password) => {
    return bcrypt.compareSync(password, this.password.passwordSpinner);
};

module.exports = mongoose.model('Spinners', SpinnersSchema);