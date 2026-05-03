const mongoose = require('mongoose')

const applianceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    power: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, { timestamps: true })

const appliances = mongoose.model("appliances", applianceSchema)

module.exports = appliances