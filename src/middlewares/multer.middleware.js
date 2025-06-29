import multer from "multer";
import { extname } from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/tmp/uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + extname(file.originalname));
    },
});

export const upload = multer({ storage: storage })
// export const upload = multer({ storage });
