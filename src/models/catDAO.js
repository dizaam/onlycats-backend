import neo4j from "../utils/neo4j"
let cats;

export default class CatDAO {
	static async injectDB(conn) {
		if (cats) return;

		try {
			cats = await conn.db("onlycats").collection("cats");
			cats.createIndex(
				{username: 1},
				{unique: true}
			);
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

	static async create(data) {
		const username = data.username;
		try {
			const result = await cats.insertOne(data);
			// console.log(result.insertedId.toString());
			await neo4j.write("CREATE(n:Cat{username: $username})", {username: username});
			return 0;
		} catch(e) {
      if (String(e).startsWith("MongoError: E11000 duplicate key error")) {
        return { error: "A cat with the given username already exists." }
      }
      console.error(`Error occurred while adding new cat, ${e}.`)
      return { error: e }
		}


	}

	static async delete(username) {
		try {
			const cursor = await cats.deleteOne({username: username});
			await neo4j.write("MATCH(c:Cat) WHERE c.username = $username DETACH DELETE (c)", {username: username});
			return !cursor.deletedCount;
		} catch(e) {
			console.error(e);
		}
	}

	static async update(username, body_params) {
		try {
			const cursor = await cats.findOneAndUpdate({username: username}, {$set: body_params});
			return cursor;
		} catch(e) {
			console.error(e);
		}
	}

	static async login(username, password) {
		try {
			const cursor = await cats.findOne({username: username, password: password});
			return cursor;
		} catch(e) {
			console.error(e);
		}
	}


	static async follow(username, username_to_follow) {
		try {
			await cats.findOneAndUpdate(
				{username: username},
				{ $inc: {following: 1}}
			);

			await cats.findOneAndUpdate(
				{username: username_to_follow},
				{ $inc: {follower: 1}}
			);

			await neo4j.write(`
				MATCH(c1:Cat), (c2:Cat)
				WHERE c1.username = $username AND c2.username = $username_to_follow
					CREATE (c1) - [fol: FOLLOW] -> (c2)
			`, {
				username: username,
				username_to_follow: username_to_follow
			});

			return 0;
		} catch(e) {
			console.error(e);
		}
	}

	static async unfollow(username, username_to_unfollow) {
		try {
			await cats.findOneAndUpdate(
				{username: username},
				{ $inc: {following: -1}}
			);

			await cats.findOneAndUpdate(
				{username: username_to_unfollow},
				{ $inc: {follower: -1}}
			);

			await neo4j.write(`
				MATCH(c1:Cat) - [fol:FOLLOW] -> (c2:Cat)
				WHERE c1.username = $username AND c2.username = $username_to_unfollow
					DELETE (fol)
			`, {
				username: username,
				username_to_unfollow: username_to_unfollow
			});

			return 0;
		} catch(e) {
			console.error(e);
		}
	}

	static async getFollowing(username) {
		try {
			let result = await neo4j.read(`
				MATCH(c1:Cat) - [fol:FOLLOW] -> (c2:Cat)
				WHERE c1.username = $username
				RETURN (c2)
			`, {
				username: username
			})

			result = result.records.map(record => {
				return {
					username: record._fields[0].properties.username
				}
			});

			return result;
		} catch(e) {
			console.error(e);
		}
	}

	static async getFollower(username) {
		try {
			let result = await neo4j.read(`
				MATCH(c1:Cat) - [fol:FOLLOW] -> (c2:Cat)
				WHERE c2.username = $username
				RETURN (c1)
			`, {
				username: username
			})

			result = result.records.map(record => {
				return {
					username: record._fields[0].properties.username
				}
			});


			return result;
		} catch(e) {
			console.error(e);
		}
	}



}