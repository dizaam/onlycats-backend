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
			const result = await post.insertOne(data);
			await neo4j.write("CREATE(p:Post{id: $id})", {id: result.insertedId.toString()});
			return 0;
		} catch(e) {
			console.error(e);
      return { error: e }
		}
	}

	static async delete(id) {
		try {
			await post.deleteOne({_id:  mongodb.ObjectId(id)});
			await neo4j.write(`
				MATCH(p:Post)
				WHERE p.id = $id
					DETACH
					DELETE p
			`, {
				id: id
			});
			
			return 0;
		} catch(e) {
			console.error(e);
      return { error: e }
		}
	}

	static async like(username, post_id) {
		try {
			await post.updateOne(
				{_id:  mongodb.ObjectId(post_id)},
				{$inc: {
					likes: 1
				}}
			);
			await neo4j.write(`
				MATCH(p:Post), (c:Cat)
				WHERE p.id = $post_id AND c.username = $username
					CREATE (p) - [like:LIKED_BY] -> (c)
			`, {
				post_id: post_id,
				username: username
			});
			return 0;
		} catch(e) {
			console.error(e);
      return { error: e }
		}
	}

	static async unlike(username, post_id) {
		try {
			await post.updateOne(
				{_id:  mongodb.ObjectId(post_id)},
				{$inc: {
					likes: -1
				}}
			);
			await neo4j.write(`
				MATCH(p:Post) - [like:LIKED_BY] -> (c:Cat)
				WHERE p.id = $post_id AND c.username = $username
					DELETE like
			`, {
				post_id: post_id,
				username: username
			});
			return 0;
		} catch(e) {
			console.error(e);
      return { error: e }
		}
	}


}