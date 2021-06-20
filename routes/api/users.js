const express = require('express');
const router = express.Router();
const { check, validation, validationResult } = require('express-validator');
const gravater = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');

router.post(
    '/',
    [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    async (req, res) => {
        //validation of request
        console.log(19);
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            res.status(400).json({errors: errors.array()});
            console.log(23);
        }

        //save the request details
        const { name, email, password } = req.body;

        try {
            //Check if the user already exists
            let user = await User.findOne({ email });
            console.log(32);
            if (user) {
                res.status(400).json({ errors: [{ msg: 'User already exists' }] });
                console.log(35);
            }

            //get users avatar:
            const avatar = gravater.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
            user = new User({ name, email, avatar, password });
            console.log(45);

            //password encryption:
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            console.log(50);
            console.log(user.name);
            user.save();
            console.log(52);

            //returning a web token
            const payload = {
                user: {
                    id: user.id
                }
            };

            console.log(61);
            jwt.sign(
                payload, 
                config.get('jwtSecret'), 
                { expiresIn: 3600000 },
                (error, token) => {
                    if (error) {
                        console.log(68);
                        throw error;
                    }
                    res.json({ token });
                    console.log(72);
                }    
            );

        //catch any sort of unexpected server error
        } catch (err) {
            console.log(err.message);
            console.log(79);
            res.status(500, 'Server Error');
        }
    }
);

module.exports = router;