let post;

export default class PostDAO {
	static async injectDB(conn) {
		if (post) return;

		try {
			post = await conn.db("onlycats").collection("post");
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

	static async add(data) {
		try {
			await post.insertOne(data);
			return {success: true};
		} catch(e) {
      if (String(e).startsWith("MongoError: E11000 duplicate key error")) {
        return { error: "A cat with the given username already exists." }
      }
      console.error(`Error occurred while adding new cat, ${e}.`)
      return { error: e }
		}
	}
}