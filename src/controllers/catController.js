import multer from "multer";
import storage from "../utils/storage";
import CatDAO from "../models/catDAO"
import response from "../utils/response_header";

export default {
	getAll: async(req, res) => {
		try {
			const result = await CatDAO.getAll();

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

	getByUsername: async(req, res) => {
		const username = req.params.username;
		try {
			const result = await CatDAO.getByUsername(username);

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

	uploadImage: multer({storage: storage}).single("profile_picture"),

	create: async(req, res) => {
		let profile_picture;

		try {
			profile_picture = ("http://localhost:8080/uploads/" + req.file.path.split('/').slice(1)[8]);
		} catch(e){

		}

		let body = {
			...req.body,
			profile_picture
		}

		try {
			// delete null data 
			for (const field in body) {
				if (!body[field]) {
					delete body[field];
				}
			}

			const result = await CatDAO.create({
				...body
			});

			if(result) {
				res.status(200).json({
					...response.success(),
					data: body
				});
			} else {
				console.error("duplicate username");
				res.status(400).json({
					...response.duplicate(body.username)
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
		const username = req.params.username;

		try {
			const result = await CatDAO.delete(username);
			if(result) {
				res.status(200).json({
					...response.success(),
				});
			} else {
				console.error("username cannot found");
				res.status(400).json({
					...response.notFound(username)
				})
			}
		} catch(e) {
			console.error(e);
			res.status(500).json({
				...response.serverError,
			});
		}
	},

	update: async(req, res) => {
		let profile_picture;

		try {
			profile_picture = ("http://localhost:8080/uploads/" + req.file.path.split('/').slice(1)[8]);
		} catch(e){

		}

		let body = {
			...req.body,
			profile_picture
		}

		try {
			// delete null data 
			for (const field in body) {
				if (!body[field]) {
					delete body[field];
				}
			}

			const result = await CatDAO.update(body.username, body);
			
			if(result) {
				res.status(200).json({
					...response.success(),
				});
			} else {
				console.error("username cannot found");
				res.status(400).json({
					...response.notFound(body.username)
				})
			}
		} catch(e) {
			console.error(e);
			res.status(500).json({
				...response.serverError,
			});
		}
	},

	login: async(req, res) => {
		const username = req.body.username;
		const password = req.body.password;
		try {
			const result = await CatDAO.login(username, password);
			
			if(result) {
				res.status(200).json({
					...response.success(),
				});
			} else {
				console.error("username cannot found");
				res.status(400).json({
					...response.notFound(username)
				})
			}

		} catch(e) {
			console.error(e);
			res.status(500).json({
				...response.serverError,
			});
		}
	},

	follow: async(req, res) => {
		const username = req.body.username;
		const username_to_follow = req.body.username_to_follow;

		try {
			const result = await CatDAO.follow(username, username_to_follow);

			if(result) {
				res.status(200).json({
					...response.success(),
				});
			} else {
				console.error("username cannot found");
				res.status(400).json({
					...response.notFound(username)
				})
			}

		} catch(e) {
			console.error(e);
			res.status(500).json({
				...response.serverError,
			});
		}
	},

	unfollow: async(req, res) => {
		const username = req.body.username;
		const username_to_unfollow = req.body.username_to_unfollow;

		try {
			const result = await CatDAO.unfollow(username, username_to_unfollow);

			if(result) {
				res.status(200).json({
					...response.success(),
				});
			} else {
				console.error("username cannot found");
				res.status(400).json({
					...response.notFound(username)
				})
			}

		} catch(e) {
			console.error(e);
			res.status(500).json({
				...response.serverError,
			});
		}
	},

	getFollowing: async(req, res) => {
		const username = req.params.username;

		try {
			const result = await CatDAO.getFollowing(username);

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

	getFollower: async(req, res) => {
		const username = req.params.username;

		try {
			const result = await CatDAO.getFollower(username);

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