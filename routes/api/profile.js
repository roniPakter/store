const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

router.get('/me', auth, async (req,res) => {
    try {
        const profile = await (await Profile.findOne({ user : req.user.id }).populate( 'user', ['name', 'avatar'] ));

        if (!profile) {
            return res.status(500).json({ msg: 'No profile for this user' });
        }

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/', 
    [ auth,[
    check('phone', 'Phone is required').not().isEmpty(),
    check('role', 'Role is required').not().isEmpty()]],
    async (req, res) => {
        errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { phone, role } = req.body;
        const newProfile = {};
        newProfile.user = req.user.id;
        if (phone) newProfile.phone = phone;
        if (role) newProfile.role = role;

        
        try {
            let profile = Profile.findOne({ user: req.user.id })
            new Profile(newProfile);
        
            profile.save();
            res.send(profile);

        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server Error')
        }
})

module.exports = router;