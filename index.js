import { MongoClient } from "mongodb";
import express from "express";
import cors from "cors"
import config from "./src/utils/config";
import CatDAO from "./src/models/catDAO";
import PostDAO from "./src/models/postDAO";
import catRoute from "./src/routes/catRoute";
import postRoute from "./src/routes/postRoute";

try {
	const client = await MongoClient.connect(config.mongodb.url);
	CatDAO.injectDB(client);
	PostDAO.injectDB(client);
} catch(e) {
	console.error(e);
}

const server = express();
server.use(cors());
server.options('*', cors());
server.use(express.urlencoded({extended: true}))
server.use(express.json());
server.use('/uploads', express.static('./src/uploads'));

server.use("/api/cat", catRoute);
server.use("/api/post", postRoute);

server.listen(8080, () => {
	console.log("Server listening on port 8080");
})