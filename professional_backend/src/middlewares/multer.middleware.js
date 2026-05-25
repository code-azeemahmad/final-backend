import multer from 'multer';

const storage = multer.diskStorage({    // file stored for an instant
  destination: function (req, file, cb) {   // multer has the file, cb is a callback
    cb(null, `./public/temp`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // clg(file)
  }
})

export const upload = multer({
    storage,
})