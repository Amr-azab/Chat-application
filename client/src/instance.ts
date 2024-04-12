import axios from "axios";
const instance = axios.create({
  baseURL: "https://chat-application-3no9.onrender.com/api/chat-application",
  withCredentials: true,
});

export default instance;
