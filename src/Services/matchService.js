import axios from "axios";
import { API_BASE } from "../config/api";

const BASE_URL = `${API_BASE}/matches`;

export const getMatches = async (type) => {
  const res = await axios.get(`${BASE_URL}/${type}`);
  return res.data?.data;
};
export const getMatchDetails = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data?.data;
};