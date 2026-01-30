const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 204) return null;

    if (response.status === 401) {
      window.dispatchEvent(new CustomEvent("unauthorized"));
      throw new Error("Unauthorized");
    }
    // 3. SAFE JSON PARSING
    // Check if the response body exists and is not empty
    const contentType = response.headers.get("content-type");
    let data = null;

    if (contentType && contentType.includes("application/json")) {
      const text = await response.text(); // Get body as text first
      data = text ? JSON.parse(text) : null; // Only parse if text is not empty
    }

    // 4. Handle non-OK responses
    if (!response.ok) {
      throw new Error(data?.detail || data?.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export const authAPI = {
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  logout: () =>
    request("/auth/logout", {
      method: "POST",
    }),

  getMe: () =>
    // Changed to getMe to match AuthContext
    request("/auth/me"),
};

export const userAPI = {
  create: (userData) =>
    request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  getAll: () => request("/users"),
  getById: (id) => request(`/users/${id}`),

  // Mapping auth methods
  login: authAPI.login,
  register: authAPI.register,
  logout: authAPI.logout,
  getMe: authAPI.getMe, // Standardized naming
};

export const projectAPI = {
  create: (projectData, userId) =>
    request(`/projects?user_id=${userId}`, {
      method: "POST",
      body: JSON.stringify(projectData),
    }),

  getAll: () => request("/projects"),
  getById: (id) => request(`/projects/${id}`),
  delete: (id) =>
    request(`/projects/${id}`, {
      method: "DELETE",
    }),
};

export const taskAPI = {
  create: (taskData) =>
    request("/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    }),

  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.user_id) params.append("user_id", filters.user_id);
    if (filters.project_id) params.append("project_id", filters.project_id);
    if (filters.status) params.append("status", filters.status);

    const query = params.toString();
    return request(`/tasks${query ? `?${query}` : ""}`);
  },

  getById: (id) => request(`/tasks/${id}`),
  update: (id, updates) =>
    request(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),
  delete: (id) =>
    request(`/tasks/${id}`, {
      method: "DELETE",
    }),
};
