const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const getContent = async (path) => {
  const response = await fetch(
    `${API_BASE_URL}/api/github/content?path=${path}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

export const getContentBuffer = async (data) => {
  const pathArr = data.map((obj) => obj.path);

  const response = await fetch(
    `${API_BASE_URL}/api/github/download?path=${JSON.stringify(pathArr)}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to download file");
  }

  const responseBody = await response.json();

  console.log(responseBody.downloadDetails);

  for (const downloadDetail of responseBody.downloadDetails) {
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
  const response = await fetch(`${API_BASE_URL}/api/github/delete`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody);
  }

  return responseBody;
};

export const postContent = async ({ files, uploadPath }) => {
  console.log(uploadPath);
  if (uploadPath == undefined) uploadPath = "";

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  formData.append("path", uploadPath);

  const response = await fetch(`${API_BASE_URL}/api/github/post`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody);
  }

  console.log(responseBody);
  return responseBody;
};

export const getRateLimit = async () => {
  const response = await fetch(`${API_BASE_URL}/api/github/rateLimit`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await response.json());
  }

  return await response.json();
};
