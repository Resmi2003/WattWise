const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    profileImage: {
        type: String,
        default: ""
    },
    achievements: {
        type: [String],
        default: []
    },
    settings: {
        notifications: { type: Boolean, default: true },
        energyThreshold: { type: Number, default: 5 }
    }
})

const users = mongoose.model("users", userSchema)
module.exports = users