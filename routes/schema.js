const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { Timestamp } = require("mongodb")
const { date } = require("joi")

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    number: Number,
    email: String,
    password: String,
    token:String,
    expireAt: { type: Date, default: Date.now, index: { expires: 600 } },
    isVerified: { type: Boolean, default: false },
})

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User 