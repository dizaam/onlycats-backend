import { Router } from "express";
import catController from "../controllers/catController";

const router = Router();

router.get("/", catController.getAll);

router.get("/login", catController.login);

router.get("/:username", catController.getByUsername);

router.post("/", catController.uploadImage, catController.create);

router.patch("/", catController.update);

router.patch("/follow", catController.follow);

router.patch("/unfollow", catController.unfollow);

router.delete("/:username", catController.delete);

export {router as default}