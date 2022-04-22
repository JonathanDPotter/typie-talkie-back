import { Router } from "express";
import controller from "../controllers/user";
import extractJWT from "../middleware/extractJWT";

const router = Router();

// base route is /api/users

router.get("/", controller.getUsers);

router.get("/validate", extractJWT, controller.validateToken);

router.get("/:_id", controller.getUser);

router.post("/register", controller.register);

router.post("/login", controller.login);

export default router;
