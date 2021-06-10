const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const User = require('../../models/User');
const { check, validation, validationResult } = require('express-validator');



router.post(
    '/',
    [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        //validation of request
        // console.log('start');
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            res.status(400).json({errors: errors.array()});
        }
        // console.log('resuming to save the request');

        //save the request details
        const { email, password } = req.body;
        // console.log('saved to variable');

        try {
            //Check if the user already exists
            let user = await User.findOne({ email });
            if (!user) {
                console.log('no user');
                res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
            }
 
            //returning a web token
            const payload = {
                user: {
                    id: user.id
                }
            };

            // console.log(password);
            // console.log(user.password);
            isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log('password is wrong');
                res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
            }


            jwt.sign(
                payload, 
                config.get('jwtSecret'), 
                { expiresIn: 3600000 },
                (error, token) => {
                    if (error) {
                        throw error;
                    }
                    res.json({ token });
                }    
            );

        //catch any sort of unexpected server error
        } catch (err) {
            // console.log(err.message);
            res.status(500, 'Server Error');
        }
    }
);

router.get('/', auth, async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send('server error');
    }
});

module.exports = router;