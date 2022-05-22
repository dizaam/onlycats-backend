import { MongoClient } from "mongodb";
import express from "express";
import CatDAO from "./src/models/catDAO";
import PostDAO from "./src/models/postDAO";
import indexRoute from "./src/routes/indexRoute";
import catRoute from "./src/routes/catRoute";

try {
	const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
	CatDAO.injectDB(client);
	PostDAO.injectDB(client);
} catch(e) {
	console.error(e);
}

const server = express();
server.use(express.urlencoded({extended: true}))
server.use(express.json());
server.set("views", "./src/views");
server.set("view engine", "pug");

server.use("/api/cat", catRoute);
server.use("/", indexRoute);

server.listen(8080, () => {
	console.log("Server listening on port 8080");
})


