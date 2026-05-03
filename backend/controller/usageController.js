const usageLogs = require('../model/usageModel')
const notification = require('../model/notificationModel')


// ADD
exports.addUsageController = async (req, res) => {
    const { applianceId, applianceName, power, hours, energy, date } = req.body

    try {
        const newLog = await usageLogs.create({
            applianceId,
            applianceName,
            power,
            hours,
            energy,
            date,
            userId: req.payload
        })

        await require('./userController').updateAchievements(req.payload)

        // Notification logic (LOWERCASE VARIABLE)
        if (Number(energy) > 5) {
            await notification.create({
                userId: req.payload,
                message: "High energy usage detected"
            })
        }

        res.status(200).json(newLog)

    } catch (err) {
        res.status(500).json("Failed to add usage")
    }
}


// GET
exports.getUsageController = async (req, res) => {
    try {

        const logs = await usageLogs.find({
            userId: req.payload
        })

        res.status(200).json(logs)

    } catch (err) {
        res.status(500).json("Failed to fetch usage")
    }
}


// DELETE
exports.deleteUsageController = async (req, res) => {
    const { id } = req.params

    try {

        const deleted = await usageLogs.findOneAndDelete({
            _id: id,
            userId: req.payload
        })

        if (!deleted) {
            return res.status(404).json("Usage not found")
        }

        res.status(200).json("Usage deleted")

    } catch (err) {
        res.status(500).json("Delete failed")
    }
}



// ANALYTICS SUMMARY
exports.analyticsSummaryController = async (req, res) => {
    try {

        const logs = await usageLogs.find({
            userId: req.payload
        })

        let totalEnergy = 0

        logs.forEach(item => {
            totalEnergy += Number(item.energy)
        })

        res.status(200).json({
            totalLogs: logs.length,
            totalEnergy: totalEnergy.toFixed(2)
        })

    } catch (error) {
        res.status(500).json("Analytics failed")
    }
}



// MONTHLY ANALYTICS
exports.monthlyAnalyticsController = async (req, res) => {
    try {

        const logs = await usageLogs.find({
            userId: req.payload
        })

        const monthlyData = {}

        logs.forEach(item => {

            const month = new Date(item.date).toLocaleString('default', {
                month: 'short'
            })

            monthlyData[month] =
                (monthlyData[month] || 0) + Number(item.energy)
        })

        res.status(200).json(monthlyData)

    } catch (error) {
        res.status(500).json("Monthly analytics failed")
    }
}