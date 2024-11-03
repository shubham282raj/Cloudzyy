import { getUser } from "./user";

const getMemoUser = async () => {
  let user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    user = await getUser();
    localStorage.setItem("user", JSON.stringify(user));
  }

  return user;
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
  }
};

export const getContentBuffer = async (data) => {
  const pathArr = data.map((obj) => obj.path);

  for (const path of pathArr) {
    const response = await getContent(path);
    const downloadDetail = {
      url: response.download_url,
      name: response.name,
    };

    const isImage =
      /\.(jpg|jpeg|png|gif|bmp|svg|webp|tiff|ico|jfif)(\?.*)?$/i.test(
        downloadDetail.url,
      );

    if (isImage) {
      // If it's an image, force the download
      fetch(downloadDetail.url)
        .then((imageResponse) => {
          if (!imageResponse.ok) throw new Error("Image download failed");
          return imageResponse.blob();
        })
        .then((blob) => {
          const blobUrl = URL.createObjectURL(blob);
          const imgLink = document.createElement("a");
          imgLink.href = blobUrl;
          imgLink.download = downloadDetail.name;
          document.body.appendChild(imgLink);
          imgLink.click();
          imgLink.remove();
          URL.revokeObjectURL(blobUrl); // Clean up
        })
        .catch((error) => console.error("Error downloading image:", error));
    } else {
      const a = document.createElement("a");
      a.href = downloadDetail.url;
      // a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }

  return 1;
};

export const deleteContent = async (data) => {
  const user = await getMemoUser();

  const responses = [];

  for (const dat of data) {
    const url = `https://api.github.com/repos/${user.githubRepoOwner}/${user.githubRepo}/contents/${dat.path}`;

    try {
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
        throw new Error(
          `GitHub API request failed with status ${response.status}`,
        );
      }

      const responseData = await response.json();
      responses.push(responseData);
    } catch (error) {
      console.error(`Error deleting content at path ${dat.path}:`, error);
      throw error;
    }
  }

  return responses;
};

export const postContent = async ({ files, uploadPath = "" }) => {
  const user = await getMemoUser();
  const responses = [];

  for (const file of files) {
    try {
      const base64Content = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]); // Remove the DataURL prefix
        reader.onerror = (error) => reject(error);
      });

      const url = `https://api.github.com/repos/${user.githubRepoOwner}/${user.githubRepo}/contents/${uploadPath ? uploadPath + "/" : ""}${file.name}`;

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
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      throw error;
    }
  }

  console.log(responses);
  return responses;
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
