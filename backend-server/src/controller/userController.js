const express = require('express');
const router = express.Router();
var validator = require('validator');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
var jwt = require('jsonwebtoken');
var slugify = require('slugify');

const generateUniqueSlug = async(name) => {
    let slug = slugify(name, {
        replacement: '-',
        remove: undefined,
        lower: false,
        strict: false,
        locale: 'vi',
        trim: true
    });

    let slugExists = await User.findOne({ slug });

    while (slugExists) {
        const randomStr = Math.random().toString(36).substring(2, 6); // Generates a 4-character random string
        slug = `${slug}-${randomStr}`;
        slugExists = await User.findOne({ slug }); // Check again
    }

    return slug;
};


router.post('/signup', async(req, res) => {

    if (!validator.isEmail(req.body.email)) {
        return res.status(400).json({ succss: false, error: 'Invalid email format' });
    }
    if (!validator.isLength(req.body.password, { min: 8 })) {
        return res.status(400).json({ succss: false, error: 'Password must be at least 8 characters long' });
    }

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
        return res.status(400).json({ succss: false, error: 'Email already exists' });
    }


    try {
        // Save user to the database
        req.body.slug = await generateUniqueSlug(req.body.name);

        const user = new User(req.body);

        // Save the user to the database
        const UserInfo = await user.save();

        const token = jwt.sign({ id: UserInfo._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true });

        res.json({ success: true, msg: "Sign up successfully", UserInfo });
    } catch (error) {
        console.error('Signup error:', error.message);
        return res.status(500).json({ succss: false, error: error.message });
    }



});

router.post('/signin', async(req, res) => {

    if (!validator.isEmail(req.body.email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!validator.isLength(req.body.password, { min: 8 })) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    try {

        // Find the user by email   
        const user = await User.findOne({ email: req.body.email });

        // Check if user exists
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate and return a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true });
        res.json({ success: true, user });

    } catch (error) {
        console.error('Login error:', error.message);
        return res.status(500).json({ error: error.message });
    }

});

router.post("/logout", async(req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout Successful!!");
});




module.exports = router;