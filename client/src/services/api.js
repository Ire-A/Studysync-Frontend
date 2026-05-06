const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export function registerUser(userData) {
  return request("/users/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function loginUser(userData) {
  return request("/users/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function logoutUser() {
  return request("/users/logout", {
    method: "POST",
  });
}

export function getProfile() {
  return request("/users/profile");
}

export function getGroups() {
  return request("/groups");
}

export function createGroup(groupData) {
  return request("/groups", {
    method: "POST",
    body: JSON.stringify(groupData),
  });
}

export function getSessions(groupId) {
  return request(`/sessions?groupId=${groupId}`);
}

export function getTasks(groupId) {
  return request(`/tasks?groupId=${groupId}`);
}

export function createSession(sessionData) {
  return request("/sessions", {
    method: "POST",
    body: JSON.stringify(sessionData),
  });
}

export function createTask(taskData) {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify(taskData),
  });
}

export function createResource(resourceData) {
  return request("/resources", {
    method: "POST",
    body: JSON.stringify(resourceData),
  });
}