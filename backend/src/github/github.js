import { Octokit } from "@octokit/core";

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
    return response.data;
  } catch (error) {
    console.error("Failed to fetch content:", error);
    throw error;
  }
};
