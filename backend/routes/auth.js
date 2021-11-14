const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const dotenv = require('dotenv');
const {body, validationResult} = require('express-validator');

dotenv.config();

const User = require('../models/UserModel');

// @route     GET api/auth
// @desc      Get logged in user
// @access    Private
router.get('/logged-in', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({errors: [{msg: "Could not find a user with provided id."}]});
        }
        res.json({user: user});
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({errors: [{msg: 'Server Error'}]});
    }
});

// @route     POST api/auth
// @desc      auth user & get token
// @access    Public
router.post('/login', [
        body('email', 'Please include a valid email.').isEmail(),
        body('password', 'Please include a valid password.').exists()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {email, password} = req.body;

        try {
            let user = await User.findOne({email});

            if (!user) {
                return res.status(400).json({errors: [{msg: 'Invalid credentials'}]});
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({errors: [{msg: 'Invalid credentials'}]});
            }

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                process.env.jwtSecret,
                {
                    expiresIn: 3600
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({token: token});
                }
            )
        } catch (err) {
            console.error(err);
            return res.status(500).json({errors: [{msg: 'Server Error'}]});
        }
    }
)

module.exports = router;