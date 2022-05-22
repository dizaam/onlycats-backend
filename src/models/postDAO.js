let post;

export default class PostDAO {
	static async injectDB(conn) {
		if (post) return;

		try {
			post = await conn.db("onlycats").collection("post");
			post.createIndex(
				{caption: "text"}
			)
		} catch(e) {
			console.error(`Unable to establish a collection handle in PostDAO: ${e}`);
		}
	}

	static async getAll() {
		try {
			const cursor = await post.find();
			return cursor.toArray();
		} catch(e) {
			console.error(e);
		}
	}

	static async getById(id) {
		try {
			const cursor = await post.findOne({_id: id});
			return cursor;
		} catch(e) {
			console.error(e);
		}
	}

	static async create(data) {
		try {
			await post.insertOne(data);
			return 0;
		} catch(e) {
			console.error(e);
      return { error: e }
		}
	}

	static async delete(id) {
		try {
			await post.deleteOne({_id: id});
			return 0;
		} catch(e) {
			console.error(e);
      return { error: e }
		}
	}

}