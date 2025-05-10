import { getUser } from "./user";

let memoUser = undefined;

export const getMemoUser = async () => {
  if (!memoUser) memoUser = await getUser();

  return memoUser;
};

export const joinPaths = (basePath, relativePath) => {
  // Remove trailing slash from basePath if it exists
  const cleanedBasePath = String(basePath)
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
  // Remove leading slash from relativePath if it exists
  const cleanedRelativePath = String(relativePath).replace(/^\/+/, "");

  console.log(
    cleanedBasePath,
    cleanedRelativePath,
    `${cleanedBasePath}/${cleanedRelativePath}`,
  );
  // Join the paths
  return `${cleanedBasePath != "" ? cleanedBasePath + "/" : ""}${cleanedRelativePath}`;
};

export const getContent = async (path) => {
  const user = await getMemoUser();

  const url = `https://api.github.com/repos/${user.githubRepoOwner}/${user.githubRepo}/contents/${path}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `token ${user.githubToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github.v3+json",
      },
      cache: "reload",
    });

    if (!response.ok) {
      throw new Error(
        `GitHub API request failed with status ${response.status}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching content:", error);
    throw error;
  }
};

// Helper function to read a file as Base64
export const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]); // Remove the DataURL prefix
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to upload a single file
export const uploadSingleFile = async (
  file,
  repoOwner,
  repo,
  uploadPath,
  fileName,
) => {
  const user = await getMemoUser();
  const base64Content = await readFileAsBase64(file);
  const url = `https://api.github.com/repos/${repoOwner}/${repo}/contents/${joinPaths(uploadPath, fileName)}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `token ${user.githubToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
      Accept: "application/vnd.github.v3+json",
    },
    body: JSON.stringify({
      message: `Adding file: ${fileName}`,
      content: base64Content,
    }),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message || `Failed to upload ${fileName}`);
  }

  return responseBody;
};

export const getRateLimit = async () => {
  const user = await getMemoUser();

  const url = `https://api.github.com/rate_limit`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `token ${user.githubToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github.v3+json",
      },
    });

    const responseBody = await response.json();

    if (!response.ok) {
      throw new Error(
        responseBody.message || "Failed to get rate limit information",
      );
    }

    return responseBody;
  } catch (error) {
    console.error("Error fetching rate limit:", error);
    throw error;
  }
};
