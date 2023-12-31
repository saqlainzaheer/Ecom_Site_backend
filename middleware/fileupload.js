import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images"); // Specify the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, `${Date.now()}-${file.originalname.split(" ").join("")}`); // Generate a unique filename
  },
});

export const uploadFile = multer({ storage });
