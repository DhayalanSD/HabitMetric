const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);

  }

});

// Allow only images
const fileFilter = (req, file, cb) => {

  if (file.mimetype.startsWith("image/")) {

    cb(null, true);

  } else {

    cb(new Error("Only image files are allowed"), false);

  }

};

const upload = multer({

  storage,

  fileFilter,

});

module.exports = upload;