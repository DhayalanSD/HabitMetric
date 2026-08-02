const Notification = require("../models/Notification");

async function createNotification(
  userId,
  title,
  message
) {

  try {

    await Notification.create({

      user: userId,

      title,

      message,

    });

  } catch (err) {

    console.log(err);

  }

}

module.exports = createNotification;