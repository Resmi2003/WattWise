const express = require('express')
const userController = require('../controller/userController')
const applianceController = require('../controller/applianceController')
const jwtMiddleware = require('../middleware/jwtMiddleware')
const usageController = require('../controller/usageController')
const multerConfig = require('../middleware/multerMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const {
  getNotifications,
  markAsRead
} = require("../controller/notificationController");


const router = new express.Router()

// register
router.post('/register', userController.registerController)

// login
router.post('/login', userController.loginController)



// ================= PROFILE =================

// GET PROFILE
router.get('/profile', jwtMiddleware, userController.getProfileController)

// UPDATE PROFILE
router.put('/profile', jwtMiddleware, userController.updateProfileController)

// PROFILE IMAGE
router.put(
    '/profile-image',
    jwtMiddleware,
    multerConfig.single("profileImage"),
    userController.profileImageController
)

// CHANGE PASSWORD
router.put('/change-password', jwtMiddleware, userController.changePasswordController)

// DELETE OWN ACCOUNT
router.delete(
    '/profile',
    jwtMiddleware,
    userController.deleteOwnAccountController
)





// ================= APPLIANCES =================

// ADD
router.post('/appliances', jwtMiddleware, applianceController.addApplianceController)

// GET
router.get('/appliances', jwtMiddleware, applianceController.getApplianceController)

// DELETE
router.delete('/appliances/:id', jwtMiddleware, applianceController.deleteApplianceController)

// UPDATE
router.put('/appliances/:id', jwtMiddleware, applianceController.updateApplianceController)



// ================ USAGE ==========================

// ADD
router.post('/usage', jwtMiddleware, usageController.addUsageController)

// GET
router.get('/usage', jwtMiddleware, usageController.getUsageController)

// DELETE
router.delete('/usage/:id', jwtMiddleware, usageController.deleteUsageController)



// ================ ANALYTICS =================

// SUMMARY
router.get(
    '/analytics/summary',
    jwtMiddleware,
    usageController.analyticsSummaryController
)

// MONTHLY
router.get(
    '/analytics/monthly',
    jwtMiddleware,
    usageController.monthlyAnalyticsController
)





// ================= ADMIN =================

// ALL USERS
router.get(
    '/admin/users',
    jwtMiddleware,
    adminMiddleware,
    userController.getAllUsersController
)

// DELETE USER
router.delete(
    '/admin/user/:id',
    jwtMiddleware,
    adminMiddleware,
    userController.deleteUserController
)

// STATS
router.get(
    '/admin/stats',
    jwtMiddleware,
    adminMiddleware,
    userController.adminStatsController
)










module.exports = router