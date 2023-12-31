import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/audio");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        Math.random() +
        "-" +
        file.originalname.split(" ").join("")
    );
  },
});
export const uploadAudio = multer({ storage: storage }).single("audio");
