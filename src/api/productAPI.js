import axios from "axios";

const API = "http://localhost:5000/api/v1/product";

export const fetchAllProducts = async () => {
  const res = await axios.get(`${API}/all`);
  return res.data.products;
};
