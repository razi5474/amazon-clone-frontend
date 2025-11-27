import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;



export const fetchAllProducts = async () => {
  const res = await axios.get(`${API}/api/v1/product/all`);
  return res.data.products;
};
