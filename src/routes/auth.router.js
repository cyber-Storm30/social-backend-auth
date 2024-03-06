import express from "express";
import AuthController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/signup", AuthController.signup);
router.get("/user/:id", AuthController.getUserDetails);
router.get("/check", authMiddleware, AuthController.userAuth);
router.post("/add/connection", AuthController.addUserIdForConnections);
router.get("/people/:id", AuthController.getPeopleYouMayKnow);

export default router;
