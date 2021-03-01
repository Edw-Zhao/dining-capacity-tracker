import { Platform } from "react-native";

let baseURL = "";

Platform.OS === "android" ? (baseURL = "http://192.168.2.11:3000/api/") : (baseURL = "http://localhost:3000/api/");

export default baseURL;
