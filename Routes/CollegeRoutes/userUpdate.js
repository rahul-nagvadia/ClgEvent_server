const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const mongoose = require("mongoose");
const collageSchema = require("../../models/collageSchema"); // Replace with your actual schema path
const Clg = mongoose.model("Clg", collageSchema);
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "harmongo1145@gmail.com",
        pass: "qwpc mvud uvzx cxcg",
    },
});

function generateOTP() {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        otp += digits[randomIndex];
    }

    return otp;
}

router.post("/userUpdate", async (req, res) => {
    try {
        const user = req.body.user;

        const isverify = req.body.isVerified;
        const passChanged = req.body.passChanged;
        let clg = await Clg.findById(user.id);
        if (isverify) {
            if (passChanged) {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(user.password, saltRounds);
                clg.password = hashedPassword;
            }
            else {
                clg.password = clg.password;
            }

            clg.username = user.username
            clg.email = user.email;
            clg.mobile_no = user.mobile_no;
            clg.city = user.city;

            await Clg.findOneAndUpdate({ _id: user.id }, clg).then(() => {
                res.json({ success: true });
            });
        } else {
            const otp = generateOTP();

            const mailOptions = {
                from: "harmongo1145@gmail.com",
                to: clg.email,
                subject: "OTP for Profile Update",
                text: `Your OTP for Password Change is: ${otp}`,
            };

            try {
                transporter.sendMail(mailOptions);

                res.json({ otp: otp, success: true, email: clg.email });
            } catch (error) {
                console.error("Error sending OTP:", error);
                res.json({ success: false });
            }
        }
        // console.log(user);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
