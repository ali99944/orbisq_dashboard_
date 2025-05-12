import axios from "axios";
import { apiUrl } from "../constants/app_constants";
import { getAuthenticationToken } from "../lib/authentication";

export const useAxios = (
  contentType?: "aplication/json" | "multipart/form-data"
) => {
  const token = getAuthenticationToken();
  return axios.create({
    baseURL: apiUrl,
    headers: {
      "Content-Type": contentType as string,
      accept: "application/json",
      'session_code': localStorage.getItem('session_code'), 
      'authorization': token,
      "Access-Control-Allow-Origin": "*",
    },
  });
};
