const User = require('../models/userModel');
const businessProfile = require('../models/businessModel');
const express = require('express');
const router = express.Router();
var validator = require('validator');

router.get('/view', async(req, res) => {
    res.send({ succss: true, userinfo: req.user })
});

router.patch('/edit', async(req, res) => {
    // Validate request data
    if (!validator.isLength(req.body.name, { min: 2 })) {
        return res.status(400).json({ succss: false, error: 'Name must be at least 2 characters long' });
    }

    var Allowedinputs = ["name", "age", "gender", "profile", "bio", "speciality", "banner"];

    for (let key in req.body) {
        if (!Allowedinputs.includes(key)) {
            return res.status(400).json({ succss: false, error: `Invalid field: ${key}` });
        }
    }

    const gender = ['Male', 'Female', 'Other'];

    if (!gender.includes(req.body.gender)) {
        return res.status(400).json({ succss: false, error: 'Invalid gender.' });
    }

    // Update user's information in the database
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true }).select("-password");
    res.send({ success: true, msg: "Profile successfully updated.", updatedUser });

});

router.post('/businessProfile', async(req, res) => {
    // Validate request data
    const { whatsapp, email, aboutus, website } = req.body;

    if (!validator.isMobilePhone(whatsapp, 'en-IN')) {
        return res.status(400).json({ succss: false, error: 'please check whatsapp no.' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ succss: false, error: 'Invalid email format' });
    }

    // res.send(req.body);

    try {
        const result = await businessProfile.findOneAndUpdate({ userId: req.user.id },
            req.body, { new: true, upsert: true } // `upsert: true` ensures insert if not found
        );
        res.send({ success: true, msg: "Business Profile successfully updated.", result });
    } catch (error) {
        console.error('Error:', error);
    }

});


module.exports = router;