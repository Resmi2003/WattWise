const Notification = require("../model/notificationModel");

// get all notifications
exports.getNotificationController = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.payload
    });

    res.status(200).json(notifications); 

  } catch (err) {
    res.status(500).json([]); 
  }
};



// mark as read
exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true
    });

    res.status(200).json("Updated");
  } catch (err) {
    res.status(500).json("Error updating");
  }
};