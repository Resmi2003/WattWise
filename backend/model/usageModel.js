const mongoose = require('mongoose')

const usageSchema = new mongoose.Schema({
    applianceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "appliances",
        required: true
    },
    applianceName: {
        type: String,
        required: true
    },
    power: {
        type: Number,
        required: true
    },
    hours: {
        type: Number,
        required: true
    },
    energy: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
}, { timestamps: true })

const usageLogs = mongoose.model("usageLogs", usageSchema)

module.exports = usageLogs