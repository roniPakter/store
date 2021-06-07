const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

router.get('/', auth, (req,res) => {
    try {
        
        res.send('Auth route');
    } catch (error) {
        
    }
});

module.exports = router;