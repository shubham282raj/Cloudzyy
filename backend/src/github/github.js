import { Octokit } from "@octokit/core";
import multer from "multer";
import fs from "fs";
import path from "path";
import { response } from "express";

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const uploadMulter = multer({ storage });

export const getContent = async (user, path) => {
  const octokit = new Octokit({
    auth: user.githubToken,
  });

  try {
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: user.githubRepoOwner,
        repo: user.githubRepo,
        path: path,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Failed to fetch content:", error);
    throw error;
  }
};

export const deleteContent = async (user, data) => {
  const octokit = new Octokit({
    auth: user.githubToken,
  });

  const responses = [];

  for (const dat of data) {
    const response = await octokit.request(
      "DELETE /repos/{owner}/{repo}/contents/{path}",
      {
        owner: user.githubRepoOwner,
        repo: user.githubRepo,
        path: dat.path,
        message: `Deleting File: ${dat.path}`,
        sha: dat.sha,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    responses.push(response);
  }

  return response;
};

export const postContent = async (user, files, githubPath) => {
  const octokit = new Octokit({
    auth: user.githubToken,
  });

  const reponses = [];

  for (const file of files) {
    const fileContent = fs.readFileSync(file.path);
    const base64Content = fileContent.toString("base64");

    const response = await octokit.request(
      "PUT /repos/{owner}/{repo}/contents/{path}",
      {
        owner: user.githubRepoOwner,
        repo: user.githubRepo,
        path: path.join(githubPath, file.originalname).replace(/\\/g, "/"),
        message: `Adding file: ${file.originalname}`,
        content: base64Content,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    reponses.push(response);
  }

  return reponses;
};
