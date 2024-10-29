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
