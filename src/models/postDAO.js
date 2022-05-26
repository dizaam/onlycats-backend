import neo4j from "../utils/neo4j";
import mongodb from "mongodb";
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

	static async search(text) {
		try {
			const cursor = await post.aggregate(
				[
					{ $match: { $text: { $search: text }}}
				]
			);
			return cursor.toArray();
		} catch(e) {
			console.error(e);
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
			const cursor = await post.findOne({_id: mongodb.ObjectId(id)});
			return cursor;
		} catch(e) {
			console.error(e);
		}
	}

	static async getByUsername(username) {
		try {
			const cursor = await post.find({created_by: username});
			return cursor.toArray();
		} catch(e) {
			console.error(e);
			return false;
		}
	}


	static async getByFollowing(usernames) {
		try {
			const cursor = await post.find(
				{
					created_by: {$in: [...usernames]}
				}
			);
			return cursor.toArray();
		} catch(e) {
			console.error(e);
		}
	}

	static async create(data) {
		try {
			const result = await post.insertOne(data);
			await neo4j.write("CREATE(p:Post{id: $id})", {id: result.insertedId.toString()});
			return true;
		} catch(e) {
			console.error(e);
      return { error: e }
		}
	}

	static async delete(id) {
		try {
			const flag = await post.deleteOne({_id:  mongodb.ObjectId(id)});

			if (flag.deletedCount === 0) {
				return false;
			}

			await neo4j.write(`
				MATCH(p:Post)
				WHERE p.id = $id
					DETACH
					DELETE p
			`, {
				id: id
			});
			
			return true;
		} catch(e) {
			console.error(e);
      return { error: e }
		}
	}

	static async like(username, post_id) {
		try {
			const flag = await post.updateOne(
				{_id:  mongodb.ObjectId(post_id)},
				{$inc: {
					likes: 1
				}}
			);

			if (flag.matchedCount === 0) {
				return false;
			}

			await neo4j.write(`
				MATCH(p:Post), (c:Cat)
				WHERE p.id = $post_id AND c.username = $username
					CREATE (p) - [like:LIKED_BY] -> (c)
			`, {
				post_id: post_id,
				username: username
			});
			return true;
		} catch(e) {
			console.error(e);
      return { error: e }
		}
	}

	static async unlike(username, post_id) {
		try {
			const flag = await post.updateOne(
				{_id:  mongodb.ObjectId(post_id)},
				{$inc: {
					likes: -1
				}}
			);

			if (flag.matchedCount === 0) {
				return false;
			}

			await neo4j.write(`
				MATCH(p:Post) - [like:LIKED_BY] -> (c:Cat)
				WHERE p.id = $post_id AND c.username = $username
					DELETE like
			`, {
				post_id: post_id,
				username: username
			});
			return true;
		} catch(e) {
			console.error(e);
      return { error: e }
		}
	}

	static async getLikes(post_id) {
		try {
			let result = await neo4j.read(`
				MATCH(p:Post) - [like:LIKED_BY] -> (c:Cat)
				WHERE p.id = $post_id
					RETURN (c)
			`, {
				post_id: post_id
			});

			result = result.records.map(record => {
				return {
					username: record._fields[0].properties.username
				}
			});

			return result;
		} catch(e) {
			console.error(e);
			return false;
		}
	}

}