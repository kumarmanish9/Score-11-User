import axios from "axios";

const BASE_URL = "http://68.178.171.95:3000/api/v1/matches";

export const getMatches = async (type) => {
  const res = await axios.get(`${BASE_URL}/${type}`);
  return res.data?.data;
};
export const getMatchDetails = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data?.data;
};