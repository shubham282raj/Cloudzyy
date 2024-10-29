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
