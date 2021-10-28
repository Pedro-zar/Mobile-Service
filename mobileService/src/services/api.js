import axios from "axios";

/**
 * Api de conexão com o banco de dados Anchieta
 */
const api = axios.create({
  baseURL: "http://localhost:8080/mobile-apps/mobileService/banco",
});

export default api;
