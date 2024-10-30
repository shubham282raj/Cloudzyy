import { response, Router } from "express";
import verifyToken from "../middleware/auth.js";
import { getUser } from "../middleware/user.js";
import {
  deleteContent,
  getContent,
  getRateLimit,
  postContent,
  uploadMulter,
} from "../github/github.js";

const github = Router();

github.get("/content", verifyToken, getUser, async (req, res) => {
  try {
    const response = await getContent(req.user, req.query.path);
    return res.status(200).send({ message: "OKAY", content: response });
  } catch (error) {
    try {
      const response = await getContent(req.user, "");
      return res
        .status(200)
        .send({ message: "Forced Root", content: response });
    } catch (error) {
      console.error("Error fetching content:", error);
      return res
        .status(500)
        .send({ message: "Error fetching content", error: error.message });
    }
  }
});

github.get("/download", verifyToken, getUser, async (req, res) => {
  try {
    const downloadDetails = [];
    for (const path of JSON.parse(req.query.path)) {
      const response = await getContent(req.user, path);
      downloadDetails.push({
        url: response.data.download_url,
        name: response.data.name,
      });
    }

    return res.status(200).send({ downloadDetails });
  } catch (error) {
    console.error("Error fetching content:", error);
    return res
      .status(500)
      .send({ message: "Error fetching content", error: error.message });
  }
});

github.delete("/delete", verifyToken, getUser, async (req, res) => {
  try {
    const response = await deleteContent(req.user, req.body.data);
    return res.status(200).send(response);
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Failed to delete" });
  }
});

github.post(
  "/post",
  verifyToken,
  getUser,
  uploadMulter.array("files"),
  async (req, res) => {
    try {
      const response = await postContent(req.user, req.files, req.body.path);
      return res
        .status(200)
        .json({ message: "Files uploaded successfully", response });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Failed to upload files" });
    }
  }
);

github.get("/rateLimit", verifyToken, getUser, async (req, res) => {
  try {
    const response = await getRateLimit(req.user);
    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get rate limit" });
  }
});

export default github;
