const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const shareData = async (data) => {
  const response = await fetch(`${API_BASE_URL}/api/share`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody.key;
};

export const getData = async (key) => {
  const response = await fetch(`${API_BASE_URL}/api/share/${key}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody.data;
};
