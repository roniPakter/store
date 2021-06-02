const express = require('express');
const router = express.Router();
const { check, validation, validationResult } = require('express-validator/check');

router.post(
    '/',
    [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            res.status(400).json({errors: errors.array()});
        }
        res.send('submitted');
    }
);

module.exports = router;