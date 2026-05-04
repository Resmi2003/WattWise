const userModel = require('../model/userModel')
const applianceModel = require('../model/applianceModel')
const usageModel = require('../model/usageModel')
const mongoose = require('mongoose')

// ================= ALL USERS =================
exports.getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find().select('-password')
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

// ================= DELETE USER =================
exports.deleteUserController = async (req, res) => {
    try {
        const { id } = req.params
        const loggedInUserId = req.payload

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json("Invalid user ID")
        }

        const userToDelete = await userModel.findById(id)

        if (!userToDelete) {
            return res.status(404).json("User not found")
        }

        if (userToDelete.role === "admin") {
            return res.status(403).json("Admin account cannot be deleted")
        }

        if (loggedInUserId === id) {
            return res.status(400).json("You cannot delete yourself")
        }

        await userModel.findByIdAndDelete(id)
        await applianceModel.deleteMany({ userId: id })
        await usageModel.deleteMany({ userId: id })

        res.status(200).json("User deleted successfully")

    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

// ================= BLOCK / UNBLOCK =================
exports.toggleBlockUserController = async (req, res) => {
    try {
        const { id } = req.params

        const user = await userModel.findById(id)

        if (!user) {
            return res.status(404).json("User not found")
        }

        if (user.role === "admin") {
            return res.status(403).json("Cannot block admin")
        }

        user.isBlocked = !user.isBlocked
        await user.save()

        res.status(200).json({
            message: user.isBlocked ? "User blocked" : "User unblocked"
        })

    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

// ================= ADMIN STATS =================
exports.adminStatsController = async (req, res) => {
    try {

        const totalUsers = await userModel.countDocuments()
        const totalAdmins = await userModel.countDocuments({ role: "admin" })
        const blockedUsers = await userModel.countDocuments({ isBlocked: true })
        const activeUsers = totalUsers - blockedUsers

        const totalAppliances = await applianceModel.countDocuments()
        const totalUsageLogs = await usageModel.countDocuments()

        // Get all usage logs
        const usageData = await usageModel.find()

        const totalEnergy = usageData.reduce((sum, item) => sum + Number(item.energy), 0)

        const avgEnergyPerLog =
            totalUsageLogs > 0 ? totalEnergy / totalUsageLogs : 0

        const highestEnergyUsage =
            usageData.length > 0
                ? Math.max(...usageData.map(u => Number(u.energy)))
                : 0

        // Today's energy
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const todayUsage = await usageModel.find({
            createdAt: { $gte: today }
        })

        const todayEnergy = todayUsage.reduce(
            (sum, item) => sum + Number(item.energy),
            0
        )

        // Monthly energy
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

        const monthlyUsage = await usageModel.find({
            createdAt: { $gte: startOfMonth }
        })

        const monthlyEnergy = monthlyUsage.reduce(
            (sum, item) => sum + Number(item.energy),
            0
        )

        // Top consuming user
        const energyByUser = {}

        usageData.forEach(log => {
            const userId = log.userId.toString()
            energyByUser[userId] =
                (energyByUser[userId] || 0) + Number(log.energy)
        })

        let topUserId = null
        let maxEnergy = 0

        for (const userId in energyByUser) {
            if (energyByUser[userId] > maxEnergy) {
                maxEnergy = energyByUser[userId]
                topUserId = userId
            }
        }

        const topConsumingUser = topUserId
            ? await userModel.findById(topUserId).select("username email")
            : null

        res.status(200).json({
            totalUsers,
            totalAdmins,
            activeUsers,
            blockedUsers,
            totalAppliances,
            totalUsageLogs,
            totalEnergy: Number(totalEnergy.toFixed(2)),
            avgEnergyPerLog: Number(avgEnergyPerLog.toFixed(2)),
            highestEnergyUsage: Number(highestEnergyUsage.toFixed(2)),
            todayEnergy: Number(todayEnergy.toFixed(2)),
            monthlyEnergy: Number(monthlyEnergy.toFixed(2)),
            topConsumingUser
        })

    } catch (error) {
        console.log(error)
        res.status(500).json("Admin stats error")
    }
}





// ================= ADMIN ENERGY TREND =================
exports.adminEnergyTrendController = async (req, res) => {
    try {

        const usageData = await usageModel.find()

        // ===== LAST 7 DAYS TREND =====
        const last7Days = {}
        const today = new Date()

        for (let i = 6; i >= 0; i--) {
            const date = new Date()
            date.setDate(today.getDate() - i)

            const key = date.toISOString().split("T")[0]
            last7Days[key] = 0
        }

        usageData.forEach(log => {
            const logDate = new Date(log.date).toISOString().split("T")[0]
            if (last7Days.hasOwnProperty(logDate)) {
                last7Days[logDate] += Number(log.energy)
            }
        })

        // Fix decimals for last 7 days
        for (const date in last7Days) {
            last7Days[date] = Number(last7Days[date].toFixed(2))
        }

        // ===== MONTHLY TREND =====
        const monthlyTrend = {}

        usageData.forEach(log => {
            const month = new Date(log.date).toLocaleString("default", { month: "short" })
            monthlyTrend[month] = (monthlyTrend[month] || 0) + Number(log.energy)
        })

        // Fix decimals for monthly trend
        for (const month in monthlyTrend) {
            monthlyTrend[month] = Number(monthlyTrend[month].toFixed(2))
        }

        res.status(200).json({
            last7Days,
            monthlyTrend
        })

    } catch (error) {
        res.status(500).json("Energy trend fetch failed")
    }
}