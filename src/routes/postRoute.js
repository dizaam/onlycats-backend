import { Router } from "express";
import postController from "../controllers/postController";

const router = Router();

router.get("/", postController.getAll);

router.get("/:id", postController.getByUsername);

router.post("/", postController.uploadImage, postController.create);

router.delete("/:id", postController.delete);

router.patch("/like", postController.like);

router.patch("/unlike", postController.unlike);

export {router as default}