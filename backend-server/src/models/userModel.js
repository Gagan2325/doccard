const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        select: false,
        index: true
    },
    password: {
        type: String,
        required: [true, "Password must be 8 characters"],
        minlength: 8,
        validate: {
            validator: function(value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
            },
            message: props => `Password is not strong enough! It must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.`
        }
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 99
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true,
        default: 'Other',

    },
    bio: {
        type: String
    },
    profile: {
        type: String,
        default: 'https://images.unsplash.com/photo-1741070487520-907d1359cb95',
    },
    speciality: {
        type: String,
        minlength: 2,
    },
    banner: {
        type: String
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
        minLength: 2,
        maxLength: 100,
        select: false,
    },
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', userSchema);