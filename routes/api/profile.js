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
        console.log(req.user);
        newProfile.user = req.user.id;
        if (phone) newProfile.phone = phone;
        if (role) newProfile.role = role;

        
        try {
            let profile = await Profile.findOne({ user: req.user.id });
            console.log(42);
            if (profile){
                console.log(44);
                
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id }, 
                    { $set: newProfile }, 
                    { new: true });
                return res.json(profile);
            }
            console.log(48);
            profile = new Profile(newProfile);
            await profile.save();
            console.log(51);
            res.json(profile);

        } catch (error) {
            console.log(error.message);
            res.status(500).send('Server Error')
        }
});

router.get('/', async (req,res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name' , 'avater']);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.get('/user/:user_id', async (req,res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name' , 'avater']);

        if (!profile) {
            return res.status(400).json({ msg: 'No profile for this user' });
        }

        res.json(profile);

    } catch (error) {
        console.error(error.message);
        if(error.kind == 'ObjectId'){
            return res.status(400).json({ msg: 'No profile for this user' });
        }
        res.status(500).send('Server Error');
    }
});

router.delete('/',auth, async (req,res) => {
    try {
        //delete the profile
        await Profile.findOneAndRemove({ user: req.user.id });
        //delete the user
        await User.findOneAndRemove({ _id: req.user.id });
        
        res.json({ msg: 'User Deleted' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;