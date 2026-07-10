import api from "./api";

// Get all loans for a user
export const getUserLoans = async (userId) => {
  const response = await api.get(`/loans/user/${userId}`);
  return response.data;
};