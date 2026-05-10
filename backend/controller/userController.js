const users = require('../model/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../model/userModel')
const applianceModel = require('../model/applianceModel')
const usageModel = require('../model/usageModel')
const mongoose = require('mongoose')
const notification = require('../model/notificationModel')


// REGISTER
exports.registerController = async (req, res) => {
    console.log("inside register controller");

    const { username, email, password } = req.body

    try {
        const existingUser = await users.findOne({ email })

        if (existingUser) {
            return res.status(406).json("User already exists")
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await users.create({
            username,
            email,
            password: hashedPassword
        })

        // remove password before sending response
        const { password: pwd, ...userData } = newUser._doc

        res.status(200).json(userData)

    } catch (error) {
        console.log(error)
        res.status(500).json("Register failed")
    }
}


// LOGIN
exports.loginController = async (req, res) => {
    console.log("inside login controller");

    const { email, password } = req.body

    try {
        const existingUser = await users.findOne({ email })

        if (!existingUser) {
            return res.status(404).json("User not found")
        }

        if (existingUser.isBlocked) {
            return res.status(403).json("Your account is blocked by admin")
        }

        // compare password
        const isMatch = await bcrypt.compare(password, existingUser.password)

        if (!isMatch) {
            return res.status(401).json("Incorrect password")
        }

        // create token
        const token = jwt.sign(
            {
                userId: existingUser._id,
                role: existingUser.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        // remove password before sending response
        const { password: pwd, ...userData } = existingUser._doc

        res.status(200).json({
            user: userData,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json("Login failed")
    }
}



// ================= GET PROFILE =================
exports.getProfileController = async (req, res) => {
    try {
        const userId = req.payload

        const user = await userModel.findById(userId).select('-password')

        res.status(200).json(user)

    } catch (error) {
        res.status(500).json(error)
    }
}



// ================= UPDATE PROFILE =================
exports.updateProfileController = async (req, res) => {
    try {
        const userId = req.payload
        const { username, email, settings } = req.body

        const user = await userModel.findById(userId)

        if (user) {
            user.username = username || user.username
            user.email = email || user.email

            if (settings) {
                user.settings = {
                    ...user.settings,
                    ...settings
                }
            }

            const updatedUser = await user.save()

            res.status(200).json(updatedUser)

        } else {
            res.status(404).json("User not found")
        }

    } catch (error) {
        res.status(500).json(error)
    }
}






// ================= PROFILE IMAGE UPLOAD =================
exports.profileImageController = async (req, res) => {
    try {

        const userId = req.payload
        const profileImage = req.file.filename

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { profileImage },
            { new: true }
        ).select('-password')

        res.status(200).json(updatedUser)

    } catch (error) {
        res.status(500).json(error)
    }
}



// ================= CHANGE PASSWORD =================
exports.changePasswordController = async (req, res) => {
    try {
        const userId = req.payload
        const { oldPassword, newPassword } = req.body

        const user = await userModel.findById(userId)

        const isMatch = await bcrypt.compare(oldPassword, user.password)

        if (!isMatch) {
            return res.status(401).json("Incorrect old password")
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword
        await user.save()

        res.status(200).json("Password updated successfully")

    } catch (error) {
        res.status(500).json(error)
    }
}


// ================= DELETE OWN ACCOUNT =================
exports.deleteOwnAccountController = async (req, res) => {
    try {

        const userId = req.payload

        await userModel.findByIdAndDelete(userId)
        await applianceModel.deleteMany({ userId })
        await usageModel.deleteMany({ userId })
        await notification.deleteMany({ userId })

        res.status(200).json("Account deleted successfully")

    } catch (error) {
        res.status(500).json(error)
    }
}




// update achievements
exports.updateAchievements = async (userId) => {
    try {

        const usageCount = await usageModel.countDocuments({ userId })
        const applianceCount = await applianceModel.countDocuments({ userId })

        // get all usage logs
        const usageLogs = await usageModel.find({ userId })

        // total energy consumption
        const totalEnergy = usageLogs.reduce(
            (sum, log) => sum + Number(log.energy),
            0
        )
        
        // average energy per usage
        const avgEnergy = usageCount > 0 ? totalEnergy / usageCount : 0

        let achievements = []

        if (usageCount >= 1) achievements.push("Started Tracking")
        if (usageCount >= 7) achievements.push("Consistent User")
        if (applianceCount >= 3) achievements.push("Setup Complete")


        // Awareness
        if (totalEnergy >= 20) achievements.push("Energy Aware")

        // Efficiency (low average usage)
        if (avgEnergy > 0 && avgEnergy < 2) {
            achievements.push("Efficient User")
        }

        // Engagement
        if (usageCount >= 20) achievements.push("Active User")

        // Positive saving behavior
        if (totalEnergy < 15 && usageCount >= 5) {
            achievements.push("Energy Saver")
        }

        // remove duplicates
        achievements = [...new Set(achievements)]

        await userModel.findByIdAndUpdate(userId, { achievements })

    } catch (err) {
        console.log(err)
    }
}