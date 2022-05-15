let cats;

export default class CatDAO {
	static async injectDB(conn) {
		if (cats) return;

		try {
			cats = await conn.db("onlycats").collection("cats");
		} catch(e) {
			console.error(`Unable to establish a collection handle in CatDAO: ${e}`);
		}
	}

	static async getAll() {
		try {
			const cursor = await cats.find();
			return cursor.toArray();
		} catch(e) {
			console.error(e);
		}
	}

	static async getByUsername(username) {
		try {
			const cursor = await cats.findOne({username: username});
			return cursor;
		} catch(e) {
			console.error(e);
		}
	}

	static async add(data) {
		try {
			await cats.insertOne(data);
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