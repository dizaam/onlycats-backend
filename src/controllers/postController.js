import multer from "multer";
import storage from "../utils/storage";
import response from "../utils/response_header";
import PostDAO from "../models/postDAO";
import CatDAO from "../models/catDAO";

export default {

	search: async(req, res) => {
		const text = req.query.text;

		try {
			const result = await PostDAO.search(text);

			res.status(200).json({
				...response.success(),
				data: result
			});

		} catch(e) {
			console.error(e);
			res.status(500).json({
				...response.serverError,
			});
		}
	},

	getAll: async(req, res) => {
		try {
			const result = await PostDAO.getAll();

			res.status(200).json({
				...response.success(),
				data: result
			});

		} catch(e) {
			console.error(e);
			res.status(500).json({
				...response.serverError,
			});
		}
	},

	getById: async(req, res) => {
		const id = req.params.id;
		try {
			const result = await PostDAO.getById(id);

			if(result) {
				res.status(200).json({
					...response.success(),
					data: result
				});
			} else {
				console.error("post cannot found");
				res.status(400).json({
					...response.notFound(id)
				})
			}

		} catch(e) {
			console.error(e);
			res.status(500).json({
				...response.serverError,
			});
		}
	},

	getByUsername: async(req, res) => {
		const username = req.params.username;
		try {
			const result = await PostDAO.getByUsername(username);

			if(result) {
				res.status(200).json({
					...response.success(),
					data: result
				});
			} else {
				console.error("post cannot found");
				res.status(400).json({
					...response.notFound(id)
				})
			}

		} catch(e) {
			console.error(e);
			res.status(500).json({
				...response.serverError,
			});
		}
	},

	getByFollowing: async(req, res) => {
		const username = req.params.username;
		try {
			let usernames_following = await (await CatDAO.getFollowing(username)).username;

			const result = await PostDAO.getByFollowing(usernames_following);

			res.status(200).json({
				...response.success(),
				data: result
			});

		} catch(e) {
			console.error(e);
			res.status(500).json({
				...response.serverError,
			});
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

			if(result) {
				res.status(200).json({
					...response.success(),
					data: body
				});
			} else {
				console.error("bad request on creating post");
				res.status(400).json({
					...response.badRequest()
				})
			}
		} catch(e) {
			console.error(e);
			res.status(500).json({
				...response.serverError,
			});
		}
	},

	delete: async(req, res) => {
		const id = req.params.id;

		try {
			const result = await PostDAO.delete(id);
			console.log(result);

			if(result) {
				res.status(200).json({
					...response.success(),
				});
			} else {
				console.error("bad request on creating post");
				res.status(400).json({
					...response.badRequest()
				})
			}

		} catch(e) {
			console.error(e);
			res.status(500).json({
				...response.serverError,
			});
		}
	},

	like: async(req, res) => {
		const username = req.body.username;
		const post_id = req.body.post_id;

		try {
			const result = await PostDAO.like(username, post_id);

			if(result) {
				res.status(200).json({
					...response.success(),
				});
			} else {
				console.error("post cannot found");
				res.status(400).json({
					...response.notFound(post_id)
				})
			}

		} catch(e) {
			console.error(e);
			res.status(500).json({
				...response.serverError,
			});
		}
	},

	unlike: async(req, res) => {
		const username = req.body.username;
		const post_id = req.body.post_id;

		try {
			const result = await PostDAO.unlike(username, post_id);

			if(result) {
				res.status(200).json({
					...response.success(),
				});
			} else {
				console.error("post cannot found");
				res.status(400).json({
					...response.notFound(id)
				})
			}

		} catch(e) {
			console.error(e);
			res.status(500).json({
				...response.serverError,
			});
		}
	},

	getLikes: async(req, res) => {
		const post_id = req.params.post_id;

		try {
			let result = await PostDAO.getLikes(post_id);

			res.status(200).json({
				...response.success(),
				data: result
			});

		} catch(e) {
			console.error(e);
			res.status(500).json({
				...response.serverError,
			});
		}
	},


}