import api from "./api";

// LOGIN
export const login = async (email, password) => {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post("/user/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (response.data.status === "error") {
    return response.data;
  }

  // CRITICAL FIX: Extract user metrics returned from the backend login response
  const userData = {
    access_token: response.data.access_token,
    email,
    user_id: response.data.user_id,
    monthly_income: response.data.monthly_income || 0,
    monthly_expenses: response.data.monthly_expenses || 0,
    lump_sum_available: response.data.lump_sum_available || 0
  };

  localStorage.setItem("user", JSON.stringify(userData));

  return userData;
};

// REGISTER
export const register = async (email, password) => {
  const response = await api.post("/user/create", null, {
    params: { email, password },
  });

  return response.data;
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("user");
};

// CHECK LOGIN
export const isAuthenticated = () => {
  return localStorage.getItem("user") !== null;
};

// GET USER
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};