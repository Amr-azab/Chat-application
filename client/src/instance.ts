import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:8000/api/chat-application",
  withCredentials: true,
});

export default instance;
// http://localhost:8000/api/minly-application
