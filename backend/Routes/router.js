const express = require('express')
const userController = require('../controller/userController')
const adminController = require('../controller/adminController')
const applianceController = require('../controller/applianceController')
const jwtMiddleware = require('../middleware/jwtMiddleware')
const usageController = require('../controller/usageController')
const multerConfig = require('../middleware/multerMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const notificationController = require("../controller/notificationController");
const paymentController = require('../controller/paymentController')

const router = new express.Router()

// register
router.post('/register', userController.registerController)

// login
router.post('/login', userController.loginController)

// google login
router.post('/google-login', userController.googleLoginController)



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



// ===================== NOTIFICATION ==================
router.post(
    "/notifications",
    jwtMiddleware,
    notificationController.createNotification
);

router.get(
    "/notifications",
    jwtMiddleware,
    notificationController.getNotificationController
);


router.put(
    "/notifications/clear-all",
    jwtMiddleware,
    notificationController.markAllAsRead
);

router.put(
    "/notifications/:id",
    jwtMiddleware,
    notificationController.markAsRead
);




// ======================= PAYMENT ======================
router.post(
    '/create-checkout-session',
    jwtMiddleware,
    paymentController.createCheckoutSessionController
)

router.put(
    '/make-premium',
    paymentController.makePremiumController
)




// ================= ADMIN =================

// ALL USERS
router.get(
    '/admin/users',
    jwtMiddleware,
    adminMiddleware,
    adminController.getAllUsersController
)

// DELETE USER
router.delete(
    '/admin/user/:id',
    jwtMiddleware,
    adminMiddleware,
    adminController.deleteUserController
)

// STATS
router.get(
    '/admin/stats',
    jwtMiddleware,
    adminMiddleware,
    adminController.adminStatsController
)


// USER BLOCK MANAGEMENT
router.put(
    '/admin/user/block/:id',
    jwtMiddleware,
    adminMiddleware,
    adminController.toggleBlockUserController
)


// ENERGY TREND
router.get(
    '/admin/energy-trend',
    jwtMiddleware,
    adminMiddleware,
    adminController.adminEnergyTrendController
)


// EXPORT CSV
router.get(
    '/admin/export/csv',
    jwtMiddleware,
    adminMiddleware,
    adminController.exportCSVController
)

// EXPORT PDF
router.get(
    '/admin/export/pdf',
    jwtMiddleware,
    adminMiddleware,
    adminController.exportPDFController
)

// ADMIN INSIGHTS
router.get(
    '/admin/insights',
    jwtMiddleware,
    adminMiddleware,
    adminController.adminInsightsController
)


// ADMIN LEADERBOARD
router.get(
    '/admin/leaderboard',
    jwtMiddleware,
    adminMiddleware,
    adminController.adminLeaderboardController
);


// ADMIN ALERTS
router.get(
    '/admin/alerts',
    jwtMiddleware,
    adminMiddleware,
    adminController.adminAlertsController
);

//
router.get(
    '/admin/usage-logs',
    jwtMiddleware,
    adminMiddleware,
    adminController.getAllUsageLogsController
)


// ================= ADMIN APPLIANCES =================

// GET ALL APPLIANCES (ADMIN)
router.get(
    '/admin/appliances',
    jwtMiddleware,
    adminMiddleware,
    adminController.getAllAppliancesController
)

// DELETE ANY APPLIANCE (ADMIN)
router.delete(
    '/admin/appliances/:id',
    jwtMiddleware,
    adminMiddleware,
    adminController.deleteAnyApplianceController
)













module.exports = router