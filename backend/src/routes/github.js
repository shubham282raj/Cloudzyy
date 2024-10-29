import { Router } from "express";
import verifyToken from "../middleware/auth.js";
import { getUser } from "../middleware/user.js";
import { getContent } from "../github/github.js";

const github = Router();

github.get("/content", verifyToken, getUser, async (req, res) => {
  const response = await getContent(req.user, req.body.path);

  return res.status(200).send({ message: "OKAY", content: response });
});

export default github;
