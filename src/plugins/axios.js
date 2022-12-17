import axios from "axios";

const mainAxios = axios.create({
  baseURL: "https://localhost:7096",
});

const customAxios = axios.create({
  baseURL: "/distance",
});

export default {
  mainAxios,
  customAxios,
};
