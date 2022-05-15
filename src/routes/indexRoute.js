import { Router } from "express";
import indexController from "../controllers/indexController";

const router = Router();

router.get("/register", indexController.register)

export {router as default}