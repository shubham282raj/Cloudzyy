const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const registerUser = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/user/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const loginUser = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const validateAuthToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token Invalid");
  }

  return response.json();
};

export const getUser = async () => {
  const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to get User");
  }

  const userData = await response.json();
  return userData;
};

export const logOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error while Logging Out");
  }
};
