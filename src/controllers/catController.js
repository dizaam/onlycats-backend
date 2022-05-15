import CatDAO from "../models/catDAO"

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
		try {
			const result = await CatDAO.getByUsername(req.params.username);
			res.send(result);
		} catch(e) {
			console.error(e);
		}
	},

	add: async(req, res) => {
		try {
			for (const field in req.body) {
				if (!req.body[field]) delete req.body[field]
			}

			const result = await CatDAO.add(req.body);
			if(result.success) {
				res.send("success");
			} else {
				res.send("failed")
			}
		} catch(e) {
			console.error(e);
		}
	}
}