import axios from "axios";

const getCustomers = () => {
  return axios.post("/api/customers/get", { data: 1 });
};

const getOrders = () => {
  return axios.get("/api/orders/get");
};

export const http = {
  getCustomers,
  getOrders,
};
