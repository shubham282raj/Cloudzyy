import { response, Router } from "express";
import verifyToken from "../middleware/auth.js";
import { getUser } from "../middleware/user.js";
import { deleteContent, getContent } from "../github/github.js";

const github = Router();

github.get("/content", verifyToken, getUser, async (req, res) => {
  try {
    const response = await getContent(req.user, req.query.path);
    return res.status(200).send({ message: "OKAY", content: response });
  } catch (error) {
    console.error("Error fetching content:", error);
    return res
      .status(500)
      .send({ message: "Error fetching content", error: error.message });
  }
});

github.delete("/delete", verifyToken, getUser, async (req, res) => {
  try {
    const response = await deleteContent(req.user, req.body.path, req.body.sha);
    return res.status(200).send({ message: "Deleted Successfully", response });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).send({ response });
  }
});

export default github;
