const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    whatsapp: {
        type: String,
        minlength: 2,
    },
    email: {
        type: String,
        minlength: 2,
    },
    aboutus: {
        type: String,
        minlength: 2,
        maxlength: 255,
    },
    website: {
        type: String,
        minlength: 2,
    },

}, { timestamps: true });

module.exports = mongoose.model('businessProfile', businessSchema);