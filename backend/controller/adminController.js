const userModel = require('../model/userModel')
const applianceModel = require('../model/applianceModel')
const usageModel = require('../model/usageModel')
const mongoose = require('mongoose')
const PDFDocument = require("pdfkit")





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

        // ===== APPLIANCE DISTRIBUTION =====
        const applianceDistribution = {}

        usageData.forEach(log => {

            const name = log.applianceName
                ? log.applianceName.toLowerCase().trim()
                : "unknown";

            applianceDistribution[name] =
                (applianceDistribution[name] || 0) + Number(log.energy)
        })

        // Fix decimals
        for (const key in applianceDistribution) {
            applianceDistribution[key] = Number(applianceDistribution[key].toFixed(2))
        }

        res.status(200).json({
            last7Days,
            monthlyTrend,
            applianceDistribution
        })

    } catch (error) {
        res.status(500).json("Energy trend fetch failed")
    }
}



// ================= GET ALL APPLIANCES =================
exports.getAllAppliancesController = async (req, res) => {
    try {

        const appliances = await applianceModel
            .find()
            .populate("userId", "username email") // get user info

        res.status(200).json(appliances)

    } catch (error) {
        res.status(500).json("Failed to fetch appliances")
    }
}


// ================= DELETE ANY APPLIANCE =================
exports.deleteAnyApplianceController = async (req, res) => {
    try {

        const { id } = req.params

        const deleted = await applianceModel.findByIdAndDelete(id)

        if (!deleted) {
            return res.status(404).json("Appliance not found")
        }

        res.status(200).json("Appliance deleted")

    } catch (error) {
        res.status(500).json("Delete failed")
    }
}


// ================= EXPORT CSV =================
exports.exportCSVController = async (req, res) => {
    try {

        const usageData = await usageModel
            .find()
            .populate("userId", "username email")

        let csv = "User,Email,Appliance,Energy(kWh),Hours,Date\n"

        usageData.forEach(item => {
            csv += `${item.userId?.username || "N/A"},`
            csv += `${item.userId?.email || "N/A"},`
            csv += `${item.applianceName},`
            csv += `${item.energy},`
            csv += `${item.hours},`
            csv += `${new Date(item.date).toISOString().split("T")[0]}\n`
        })

        res.header("Content-Type", "text/csv")
        res.attachment("report.csv")

        res.send(csv)

    } catch (error) {
        res.status(500).json("CSV export failed")
    }
}


// ================= EXPORT PDF =================
exports.exportPDFController = async (req, res) => {
    try {

        const usageData = await usageModel
            .find()
            .populate("userId", "username email")

        const doc = new PDFDocument()

        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", "attachment; filename=report.pdf")

        doc.pipe(res)

        doc.fontSize(16).text("WattWise Report", { align: "center" })
        doc.moveDown()

        usageData.forEach((item, index) => {
            doc.text(
                `${index + 1}. ${item.userId?.username || "N/A"} - ${item.applianceName} - ${item.energy} kWh`
            )
        })

        doc.end()

    } catch (error) {
        res.status(500).json("PDF export failed")
    }
}




// ================= ADMIN INSIGHTS =================
exports.adminInsightsController = async (req, res) => {
    try {

        const usageData = await usageModel.find()

        if (usageData.length === 0) {
            return res.status(200).json({
                topAppliance: null,
                topUsers: [],
                peakDay: null,
                efficiencyScore: 0
            })
        }

        // ================= MOST USED APPLIANCE =================
        const applianceMap = {}

        usageData.forEach(log => {
            const name = log.applianceName || "Unknown"
            applianceMap[name] = (applianceMap[name] || 0) + Number(log.energy)
        })

        let topAppliance = Object.entries(applianceMap)
            .sort((a, b) => b[1] - a[1])[0]

        // ================= TOP 3 USERS =================
        const userMap = {}

        usageData.forEach(log => {
            const userId = log.userId.toString()
            userMap[userId] = (userMap[userId] || 0) + Number(log.energy)
        })

        const sortedUsers = Object.entries(userMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)

        const topUsers = []

        for (const [userId, energy] of sortedUsers) {
            const user = await userModel.findById(userId).select("username email")

            if (user) {
                topUsers.push({
                    username: user.username,
                    email: user.email,
                    energy: Number(energy.toFixed(2))
                })
            }
        }

        // ================= PEAK DAY =================
        const dayMap = {}

        usageData.forEach(log => {
            const day = new Date(log.date).toISOString().split("T")[0]
            dayMap[day] = (dayMap[day] || 0) + Number(log.energy)
        })

        let peakDay = Object.entries(dayMap)
            .sort((a, b) => b[1] - a[1])[0]

        // ================= EFFICIENCY SCORE =================
        const totalEnergy = usageData.reduce((sum, item) => sum + Number(item.energy), 0)
        const avgEnergy = totalEnergy / usageData.length

        // simple logic (lower avg = better efficiency)
        let efficiencyScore = 100 - avgEnergy * 10
        if (efficiencyScore < 0) efficiencyScore = 0

        res.status(200).json({
            topAppliance: topAppliance
                ? { name: topAppliance[0], energy: Number(topAppliance[1].toFixed(2)) }
                : null,
            topUsers,
            peakDay: peakDay
                ? { date: peakDay[0], energy: Number(peakDay[1].toFixed(2)) }
                : null,
            efficiencyScore: Number(efficiencyScore.toFixed(1))
        })

    } catch (error) {
        console.log(error)
        res.status(500).json("Insights error")
    }
}



// ================= LEADERBOARD =================
exports.adminLeaderboardController = async (req, res) => {
    try {
        const usageData = await usageModel.find();

        const energyByUser = {};

        usageData.forEach(log => {
            const userId = log.userId.toString();

            energyByUser[userId] =
                (energyByUser[userId] || 0) + Number(log.energy);
        });

        const leaderboard = [];

        for (const userId in energyByUser) {
            const user = await userModel
                .findById(userId)
                .select("username email");

            if (user) {
                leaderboard.push({
                    username: user.username,
                    email: user.email,
                    energy: Number(energyByUser[userId].toFixed(2))
                });
            }
        }

        // sort descending
        leaderboard.sort((a, b) => b.energy - a.energy);

        res.status(200).json(leaderboard);

    } catch (error) {
        res.status(500).json("Leaderboard fetch failed");
    }
};


// ================= ADMIN ALERTS =================
exports.adminAlertsController = async (req, res) => {
    try {

        const usageData = await usageModel.find();

        let alerts = [];

        // HIGH ENERGY USAGE
        const highUsage = usageData.filter(u => Number(u.energy) > 5);

        if (highUsage.length > 0) {
            alerts.push({
                type: "danger",
                message: "High energy usage detected"
            });
        }

        // TODAY USAGE
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayLogs = usageData.filter(
            u => new Date(u.createdAt) >= today
        );

        const todayEnergy = todayLogs.reduce(
            (sum, u) => sum + Number(u.energy),
            0
        );

        if (todayEnergy > 20) {
            alerts.push({
                type: "warning",
                message: "Today's energy consumption is high"
            });
        }

        // DOMINATING USER
        const energyByUser = {};

        usageData.forEach(log => {
            const userId = log.userId.toString();
            energyByUser[userId] =
                (energyByUser[userId] || 0) + Number(log.energy);
        });

        const values = Object.values(energyByUser);

        if (values.length > 0) {
            const max = Math.max(...values);
            const total = values.reduce((a, b) => a + b, 0);

            if (max > total * 0.5) {
                alerts.push({
                    type: "info",
                    message: "One user is consuming majority energy"
                });
            }
        }

        // fallback
        if (alerts.length === 0) {
            alerts.push({
                type: "success",
                message: "System running normally"
            });
        }

        res.status(200).json(alerts);

    } catch (error) {
        res.status(500).json("Alerts fetch failed");
    }
};


// ================= RAW LOGS =================
exports.getAllUsageLogsController = async (req, res) => {
    try {
        const logs = await usageModel
            .find()
            .populate("userId", "username email")

        res.status(200).json(logs)

    } catch (error) {
        res.status(500).json("Failed to fetch logs")
    }
}