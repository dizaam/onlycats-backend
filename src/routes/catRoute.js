import { Router } from "express";
import catController from "../controllers/catController";

const router = Router();

router.get("/", catController.getAll);
router.get("/:username", catController.getByUsername);
router.post("/", catController.add);
router.patch("/follow", catController.follow);
router.patch("/unfollow", catController.unfollow);

export {router as default}