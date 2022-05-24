import multer from "multer";
import storage from "../utils/storage";
import PostDAO from "../models/postDAO";

export default {
	getAll: async(req, res) => {
		try {
			const result = await CatDAO.getAll();
			res.send(result);
		} catch(e) {
			console.error(e);
		}
	},

	getByUsername: async(req, res) => {
		const username = req.params.username;
		try {
			const result = await CatDAO.getByUsername(username);
			res.send(result);
		} catch(e) {
			console.error(e);
		}
	},

	uploadImage: multer({storage: storage}).single("media"),

	create: async(req, res) => {
		let media;


		try {
			media = ("http://localhost:8080/uploads/" + req.file.path.split('/').slice(1)[8]);
		} catch(e){

		}

		let body = {
			...req.body,
			media
		}

		try {
			// delete null data 
			for (const field in body) {
				if (!body[field]) {
					delete body[field];
				}
			}

			const result = await PostDAO.create({
				...body
			});

			if(!result) {
				res.send("success");
			} else {
				res.send("failed")
			}
		} catch(e) {
			console.error(e);
		}
	},

	delete: async(req, res) => {
		const id = req.params.id;
		try {
			const result = await PostDAO.delete(id);
			if(!result) {
				res.send("success");
			} else {
				res.send("failed")
			}
		} catch(e) {
			console.error(e);
		}
	},

	like: async(req, res) => {
		const username = req.body.username;
		const post_id = req.body.post_id;

		try {
			const result = await PostDAO.like(username, post_id);

			if(!result) {
				res.send("success");
			} else {
				res.send("failed")
			}
		} catch(e) {
			console.error(e);
		}
	},

	unlike: async(req, res) => {
		const username = req.body.username;
		const post_id = req.body.post_id;

		try {
			const result = await PostDAO.unlike(username, post_id);

			if(!result) {
				res.send("success");
			} else {
				res.send("failed")
			}
		} catch(e) {
			console.error(e);
		}
	},

}