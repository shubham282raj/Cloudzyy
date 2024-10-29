import { Router } from "express";
import user from "./user.js";
import auth from "./auth.js";
import github from "./github.js";

const router = Router();

router.use("/auth", auth);
router.use("/user", user);
router.use("/github", github);

export default router;
