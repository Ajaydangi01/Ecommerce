const User = require("./schema")
const postController = require("./route")
const nodemailer = require("nodemailer")
const Joi = require('joi');
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
require("dotenv").config();
const secretKey = process.env.key

require("dotenv").config();
const port = process.env.PORT
const host = process.env.HOST

function mailfunction(email, token) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ajaydangi.thoughtwin@gmail.com",
            pass: "SRAV5398@1998"
        }
    })
    const options = {
        from: "ajaydangi.thoughtwin@gmail.com",
        to: "sourabhlodhi.thoughtwin@gmail.com",
        subject: "mail sent with the help of node js",
        text: token
    }
    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log(err)
            return;
        }
        else {
            // console.log("sent" + info.response)
        }
    })

}

module.exports = {
    resgister: async (req, res) => {
        function validateUser(user) {
            const JoiSchema = Joi.object({
                firstname: Joi.string().min(3).max(30).required(),
                lastname: Joi.string().min(3).max(30).required(),
                number: Joi.number().integer().required(),
                email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
                password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            })
            return JoiSchema.validate(user)
        }
        const response = validateUser(req.body)
        if (response.error) {
            const msg = response.error.details[0].message
            res.status(422).json({ status: 422, message: msg })
            return notifier.notify({
                message: msg
            });
        }
        const email = await User.find({ email: req.body.email })
        if (email.length > 0) {
            res.status(409).send({ status: 409, message: "email already exist" })
        }
        else {
            const crypto = require('crypto');
            const secret = 'abcdefg';
            const hash = crypto.createHmac('sha256', secret)
                .update('thisisasecretkey')
                .digest('hex');
            // console.log(hash)
            const result = new User(req.body)
            result.token = hash
            const token = hash
            result.save().then((dataResult) => {
                const link = `http://${host}:${port}/confirmEmail/${token}`;
                // console.log("Email sent successfully" + " " + link)
                mailfunction(email, link);
                res.status(200).send({ status: 200, message: "singup successfully" })
            }).catch((error) => {
                console.log(error)
            })
        }
    },

    confirmEmail: async (req, res) => {
        try {
            const result = await User.findOne({ token: req.params.token })
            const finalResult = result.token
            const token = req.params.token
            const verify = result.isVerified
            if (finalResult == token) {
                const newResult = await User.updateOne({ token: req.params.token }, { isVerified: true }, { new: true })
                res.status(200).send({ status: 200, message: "You're eligible for login" })
                //   res.send("You're eligible for login")
            }
            else {
                res.send("Unauthorised user")
            }
        } catch (error) {
            console.log(error)
        }
    },

    login: async (req, res) => {
        const result = await User.find({ email: req.body.email })
        if (result.length > 0) {
            const match = await bcrypt.compare(req.body.password, result[0].password);
            console.log(result[0].isVerified)
            if (result[0].isVerified === true) {
                //  res.status(401).send({ msg: 'Your Email has  verified.' });
                if (match === true) {
                    res.send("login successfully")
                }
                else {
                    res.send("incorrect password")
                }
            } else {
                return res.send("Your Email has not been verified.")
            }
        }
    },

    // tokenGenerate: async (req, res) => {
    //     try {
    //         const result = await User.find({ email: req.body.email })
    //         if (result.length > 0) {
    //             const match = await bcrypt.compare(req.body.password, result[0].password);
    //             if (match === true) {
    //                 const result = new User(req.body)
    //                 // console.log(result)
    //                 const token = jwt.sign({ email: this.email }, secretKey, { expiresIn: "600s" })
    //                 const link = `http://${host}/${port}/confirmEmail/${token}`;
    //                 // console.log("Email sent successfully" + " " + link)
    //                 mailfunction(token, link);
    //                 res.send("mail sent successfully")
    //                 notifier.notify({ message: "mail sent successfully" })
    //             }
    //             else {
    //                 res.send("incorrect password")
    //             }
    //         }
    //         else {
    //             res.send("incorrect email address")
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

}