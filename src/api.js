
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API_URL = `${API_BASE_URL}/internships`;

function getToken() {
  return localStorage.getItem("token");
}

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Handle API response and errors
async function handleResponse(response, requireAuth = false) {
  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("Server returned an invalid response.");
  }

  // Protected API request mein token invalid/expired ho
  if (response.status === 401 && requireAuth) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }

    throw new Error(
      result.message || "Session expired. Please login again."
    );
  }

  if (!response.ok) {
    throw new Error(
      result.message || `Request failed with status ${response.status}`
    );
  }

  return result;
}

// GET all internships
export async function getInternships() {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });

  const result = await handleResponse(response, true);
  return result.data;
}

// ADD internship
export async function addInternship(internship) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(internship),
  });

  const result = await handleResponse(response, true);
  return result.data;
}

// UPDATE internship
export async function updateInternship(id, internship) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(internship),
  });

  const result = await handleResponse(response, true);
  return result.data;
}

// DELETE internship
export async function deleteInternship(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return await handleResponse(response, true);
}

// LOGIN user
export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return await handleResponse(response);
}

// REGISTER user
export async function registerUser(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  return await handleResponse(response);
}


// GET currently logged-in user
export async function getCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });

  const result = await handleResponse(response, true);

  return result.data || result.user || result;
}
