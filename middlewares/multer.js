import multer from "multer";

const storage = multer.memoryStorage({
    // destination: (req, file, cb) => {
    //   cb(null, 'uploads/'); // Save files to 'uploads' folder
    // },
    // filename: (req, file, cb) => {
    //   cb(null, Date.now() + '-' + file.originalname); // Add timestamp to filename
    // }
  });

  export const upload = multer({ storage: storage }).single('file');