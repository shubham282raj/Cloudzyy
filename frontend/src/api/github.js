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

  console.log(responseBody.content);
  return responseBody.content;
};

export const deleteContent = async (path, sha) => {
  console.log("called");
  const response = await fetch(`${API_BASE_URL}/api/github/delete`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      path,
      sha,
    }),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody);
  }

  console.log(responseBody);
  return responseBody;
};
