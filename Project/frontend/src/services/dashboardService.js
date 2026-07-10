import api from "./api";

// GET LOANS
export const getLoans = async (user_id) => {
  const res = await api.get(`/loans/user/${user_id}`);
  return res.data;
};

// CREATE LOAN
export const createLoan = async (data) => {
  const res = await api.post("/loans/create", null, {
    params: data,
  });
  return res.data;
};