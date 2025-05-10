import { getUser } from "./user";

let memoUser = undefined;

const getMemoUser = async () => {
  if (!memoUser) memoUser = await getUser();

  return memoUser;
};

const joinPaths = (basePath, relativePath) => {
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

export const deleteContent = async (data) => {
  const user = await getMemoUser();
  const responses = [];

  let fileNum = 0;
  for (const dat of data) {
    fileNum++;
    const url = `https://api.github.com/repos/${user.githubRepoOwner}/${user.githubRepo}/contents/${dat.path}`;

    try {
      if (dat.path.endsWith(".chunkdata")) {
        // If the file is a chunkdata file, delete it and its chunks
        const deleteResponse = await fetch(url, {
          method: "DELETE",
          headers: {
            Authorization: `token ${user.githubToken}`,
            "X-GitHub-Api-Version": "2022-11-28",
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: `Deleting Chunkdata File: ${dat.path}`,
            sha: dat.sha,
          }),
        });

        if (!deleteResponse.ok) {
          throw new Error(
            `Failed to delete ${dat.path}: ${deleteResponse.status}`,
          );
        }

        responses.push(await deleteResponse.json());

        // Construct the full path for the chunk folder
        const chunkFolderName = `${dat.path.substring(0, dat.path.lastIndexOf("/"))}/hiddenChunks-${dat.name.split(".chunkdata")[0]}`;
        const chunkList = await getContent(chunkFolderName);

        // Ensure chunkList is an array before iterating
        if (Array.isArray(chunkList)) {
          let chunkNum = 0;
          for (const chunk of chunkList) {
            chunkNum++;
            document.getElementById("circularLoader2").innerText =
              `Deleting File ${fileNum}/${data.length} Chunk ${chunkNum}/${chunkList.length}`;

            const chunkDeleteUrl = `https://api.github.com/repos/${user.githubRepoOwner}/${user.githubRepo}/contents/${chunk.path}`;

            const chunkDeleteResponse = await fetch(chunkDeleteUrl, {
              method: "DELETE",
              headers: {
                Authorization: `token ${user.githubToken}`,
                "X-GitHub-Api-Version": "2022-11-28",
                Accept: "application/vnd.github.v3+json",
              },
              body: JSON.stringify({
                message: `Deleting Chunk: ${chunk.path}`,
                sha: chunk.sha,
              }),
            });

            if (!chunkDeleteResponse.ok) {
              console.error(
                `Failed to delete chunk ${chunk.path}: ${chunkDeleteResponse.status}`,
              );
            } else {
              responses.push(await chunkDeleteResponse.json());
            }
          }
        } else {
          console.warn(`No chunks found for folder: ${chunkFolderName}`);
        }
      } else {
        // Regular file deletion
        document.getElementById("circularLoader2").innerText =
          `Deleting File ${fileNum}/${data.length}`;
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            Authorization: `token ${user.githubToken}`,
            "X-GitHub-Api-Version": "2022-11-28",
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: `Deleting File: ${dat.path}`,
            sha: dat.sha,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to delete ${dat.path}: ${response.status}`);
        }

        responses.push(await response.json());
      }
    } catch (error) {
      console.error(`Error deleting content at path ${dat.path}:`, error);
      throw error;
    } finally {
      document.getElementById("circularLoader2").innerText = "";
    }
  }

  return responses;
};

export const postContent = async ({ files, uploadPath = "" }) => {
  const user = await getMemoUser();
  const responses = [];
  const CHUNK_SIZE = 25 * 1024 * 1024; // 25 MB

  let fileNum = 0;
  for (const file of files) {
    fileNum++;
    try {
      if (file.size <= CHUNK_SIZE) {
        document.getElementById("circularLoader2").innerText =
          `Uploading File ${fileNum}/${files.length}`;
        // If file is less than or equal to 25 MB, upload normally
        const base64Content = await readFileAsBase64(file);
        const url = `https://api.github.com/repos/${user.githubRepoOwner}/${user.githubRepo}/contents/${joinPaths(uploadPath, file.name)}`;

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `token ${user.githubToken}`,
            "X-GitHub-Api-Version": "2022-11-28",
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: `Adding file: ${file.name}`,
            content: base64Content,
          }),
        });

        const responseBody = await response.json();

        if (!response.ok) {
          throw new Error(
            responseBody.message || `Failed to upload ${file.name}`,
          );
        }

        responses.push(responseBody);
      } else {
        // Handle chunked upload for files larger than 25 MB
        const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
        const chunkFolderName = `hiddenChunks-${file.name}`;
        const chunkPath = `${uploadPath}/${chunkFolderName}`;
        const chunkMetadata = [];

        for (let i = 0; i < chunkCount; i++) {
          document.getElementById("circularLoader2").innerText =
            `Uploading File ${fileNum}/${files.length} Chunk ${i + 1}/${chunkCount}`;
          const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
          const chunkName = `${file.name}-part-${i + 1}`;
          chunkMetadata.push(chunkName);

          const chunkResponse = await uploadSingleFile(
            chunk,
            user.githubRepoOwner,
            user.githubRepo,
            chunkPath,
            chunkName,
          );
          responses.push(chunkResponse);
        }

        // Create and upload metadata file in the uploadPath
        const metadataContent = `Chunk Names:\n${chunkMetadata.join("\n")}\nTotal Chunks: ${chunkCount}`;
        const metadataBlob = new Blob([metadataContent], {
          type: "text/plain",
        });
        const metadataFile = new File([metadataBlob], `${file.name}.chunkdata`);

        const metadataResponse = await uploadSingleFile(
          metadataFile,
          user.githubRepoOwner,
          user.githubRepo,
          uploadPath,
          `${file.name}.chunkdata`,
        );
        responses.push(metadataResponse);
      }
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      throw error;
    } finally {
      document.getElementById("circularLoader2").innerText = "";
    }
  }

  console.log(responses);
  return responses;
};

// Helper function to read a file as Base64
const readFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]); // Remove the DataURL prefix
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to upload a single file
const uploadSingleFile = async (
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
