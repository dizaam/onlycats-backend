import { Router } from "express";
import viewController from "../controllers/viewController";

const router = Router();

router.get("/register", viewController.register)

export {router as default}