const Notification = require("../model/notificationModel");

// get all notifications
exports.getNotificationController = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.payload
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);

  } catch (err) {
    res.status(500).json([]);
  }
};



// mark one as read
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


// create notification
exports.createNotification = async (req, res) => {
  try {
    const { message } = req.body;

    const newNotification = new Notification({
      userId: req.payload,
      message
    });

    await newNotification.save();

    res.status(200).json("Notification created");

  } catch (err) {
    res.status(500).json(err);
  }
};


// mark all as read
exports.markAllAsRead = async (req, res) => {
  try {

    await Notification.updateMany(
      { userId: req.payload },
      { isRead: true }
    );

    res.status(200).json("All notifications marked as read");

  } catch (err) {

    res.status(500).json("Error updating notifications");
  }
};