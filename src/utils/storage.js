import multer from "multer";
import { nanoid } from "nanoid";
import path from "path"
import { fileURLToPath } from "url";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.dirname(fileURLToPath(import.meta.url)) + "/../uploads");
	},
	filename: (req, file, cb) => {
		let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
		cb(null, nanoid() + "." + extension);
	}
})

export default storage;