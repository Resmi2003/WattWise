const mongoose = require('mongoose')

const usageSchema = new mongoose.Schema({
    applianceId: String,
    applianceName: String,
    power: Number,
    hours: Number,
    energy: Number,
    date: Date,
    userId: String
}, { timestamps: true })

const usageLogs = mongoose.model("usageLogs", usageSchema)

module.exports = usageLogs