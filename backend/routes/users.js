const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const auth = require('../middleware/auth');
const {body, query, validationResult} = require('express-validator');
const User = require('../models/UserModel');
const mongoose = require("mongoose");

dotenv.config();

const checkIdValid = (id, errorArr) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const invalidIdErr = {
            msg: "The id provided is invalid.",
            param: "id",
            location: "query"
        };
        errorArr = [...errorArr, invalidIdErr];
    }
    return errorArr;
};

// @route     GET api/users/all
// @desc      Get all users
// @access    Public
router.get('/all', async (req, res) => {
    try {
        const users = await User.find();
        res.json({successes: [{data: users}]});
    } catch (err) {
        console.error(err);
        return res.status(500).json({errors: [{msg: 'Server Error'}]});    }
});

// @route     GET api/users/get-user?id=1234
// @desc      Get a user by id
// @access    Public
router.get('/get-user', [
    query('id', 'A valid user id is required.').exists()
], async (req, res) => {

    const {id} = req.query;

    const errors = validationResult(req).array();
    const errorsArray = checkIdValid(id, [...errors]);
    if (errorsArray.length !== 0) {
        return res.status(400).json({errors: errorsArray});
    }


    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({msg: 'Could not find a user with the specified id.'});
        }

        res.json({successes: [{data: user}]});
    } catch (err) {
        console.error(err);
        return res.status(500).json({errors: [{msg: 'Server Error'}]});    }
});

// @route     POST api/register
// @desc      Get all users
// @access    Public
router.post('/register', [
        body('firstName', 'Please add a first name.').not().isEmpty(),
        body('lastName', 'Please add a first name.').not().isEmpty(),
        body('username', 'Please add an username.').not().isEmpty(),
        body('email', 'Please include a valid email.').isEmail(),
        body('password', 'Please enter a password with 6 or more characters.').isLength({min: 6})
    ], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {firstName, lastName, username, email, password} = req.body;

        try {
            let user = await User.findOne({email});
            if (user) return res.status(400).json({errors: [{"msg": 'This user already exists.'}]});
            user = await User.findOne({username});
            if (user) return res.status(400).json({errors: [{"msg": 'A user with this username already exists'}]});

            user = new User({
                firstName,
                lastName,
                username,
                email,
                password,
            });

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

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
            console.error(err.message);
            return res.status(500).json({errors: [{msg: 'Server Error'}]});        }
    }
);

// @route     PUT api/users/edit
// @desc      Update user
// @access    Private
router.put('/edit', auth, async (req, res) => {
    const {firstName, lastName, username, email} = req.body;

    const userFields = {};
    if (firstName) userFields.firstName = firstName;
    if (lastName) userFields.lastName = lastName;
    if (username) userFields.username = username;
    if (email) userFields.email = email;

    if ([firstName, lastName, username, email].every(field => userFields[field])) return;

    try {
        let user = await User.findById(req.query.id);

        if (!user) return res.status(404).json({errors: [{msg: 'User not found.'}]});

        if (user.id !== req.user.id) return res.status(401).json({errors: [{msg: 'Not authorized.'}]});

        user = await User.findOne({email});
        if (user && user.email !== email) return res.status(400).json({errors: [{"msg": 'A user with this email address already exists'}]});
        user = await User.findOne({username});
        if (user && user.username !== username) return res.status(400).json({errors: [{"msg": 'A user with this username already exists'}]});

        user = await User.findByIdAndUpdate(
            req.query.id,
            {$set: userFields},
            {new: true}
        );

        res.json({user: user});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({errors: [{msg: 'Server error.'}]});
    }

})


// @route     DELETE api/users/delete-user
// @desc      auth user and delete by id
// @access    Private
router.delete('/delete', auth, [
    query('id', 'A valid user id is required.').exists()
], async (req, res) => {

    const {id} = req.query;

    const errors = validationResult(req).array();
    const errorsArray = checkIdValid(id, [...errors]);
    if (errorsArray.length !== 0) {
        return res.status(400).json({errors: errorsArray});
    }

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({errors: [{msg: 'Could not find a user with provided id.'}]});
        }

        if (req.user.id !== id) return res.status(401).json({errors: [{msg: "You're unauthorized to delete this account."}]})

        await user.delete();

        return res.json({successes: [{msg: 'User successfully deleted.'}]});

    } catch (err) {
        console.error(err);
        return res.status(500).json({errors: [{msg: 'Server Error'}]});
    }


})

module.exports = router;
