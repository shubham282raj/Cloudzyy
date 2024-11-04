import { Router } from "express";
import user from "./user.js";
import auth from "./auth.js";
import share from "./share.js";

const router = Router();

router.use("/auth", auth);
router.use("/user", user);
router.use("/share", share);

export default router;
