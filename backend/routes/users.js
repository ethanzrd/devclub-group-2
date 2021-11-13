const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
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
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
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

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route     POST api/register
// @desc      Get all users
// @access    Public
router.post('/register', [
        body('name', 'Please add a name.').not().isEmpty(),
        body('email', 'Please include a valid email.').isEmail(),
        body('password', 'Please enter a password with 6 or more characters.').isLength({min: 6})
    ], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {name, email, password} = req.body;

        try {
            let user = await User.findOne({email});

            if (user) {
                return res.status(400).json({msg: 'User already exists.'});
            }

            user = new User({
                name,
                email,
                password
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
                    res.json({token});
                }
            )
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route     DELETE api/users/delete-user
// @desc      Auth user and delete by id
// @access    Private
router.delete('/delete-user', [
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
            return res.status(404).json({msg: 'Could not find a user with provided id.'});
        }

        await user.delete();

        return res.json({msg: 'User successfully deleted.'});

    } catch (err) {
        console.error(err);
        res.send('Server Error');
    }


})

module.exports = router;
