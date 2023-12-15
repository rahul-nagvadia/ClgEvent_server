const express = require("express");
const router = express.Router();
const user = require('../model/user');
const { body, validationResult } = require('express-validator');

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = "HarshRajeshbhaiGodkar&AbhishekKamleshbhaiJamkar"

//after successful registration
router.post("/createuser",
    [body('email').isEmail(),
    body('password', 'Password must contain at least 5 characters.').isLength({ min: 5 })], // password must be at least 5 chars long

    //end point localhost:5000/med/createuser
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //generating hashpassword(encrypting)
        const salt = await bcrypt.genSalt(10);
        let secure_password = await bcrypt.hash(req.body.password, salt);

        try {
            await user.create({
                name: req.body.name,
                password: secure_password,
                email: req.body.email,
                location: req.body.location,
                mobile: req.body.mobile
            }).then(user => {
                const data = {
                    user: {
                        id: user.id,
                        name: req.body.name
                    }
                }
                const authToken = jwt.sign(data, jwtSecret);
                success = true;
                res.json({ success, authToken });

            })
                .catch(err => {
                    console.log(err);
                    res.json({ error: "Please enter a unique value." })
                })
        } catch (err) {
            console.log("Error : " + err);
            res.json({ success: false });
        }
    })

//after filling the login form
router.post("/loginuser",
    [body('email').isEmail(),
    body('password', 'Password must contain at least 5 characters.').isLength({ min: 5 })],

    //end point localhost:5000/med/loginuser
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let email = req.body.email;
        try {
            let userdata = await user.findOne({ email })
            if (!userdata) {
                return res.status(400).json({ errors: "Invalid Email address" });
            }
            // console.log(userdata.name);

            const pwdCompare = await bcrypt.compare(req.body.password, userdata.password);

            if (!pwdCompare) {
                return res.status(400).json({ errors: "Invalid Password" });
            }

            const data = {
                user: {
                    id: userdata.id,
                    name: userdata.name
                }
            }

            const authToken = jwt.sign(data, jwtSecret);
            // console.log(authToken);
            // dec = jwt.decode(authToken,{complete:true});
            // console.log(dec.payload);
            return res.json({ success: true, authToken: authToken });
        } catch (err) {
            console.log("Error : " + err);
            res.json({ success: false });
        }
    })



module.exports = router;