import { useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase/firebase.config";
import useAuth from "./useAuth";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

// ekbar-i boshe, protita request e Firebase token (fresh) jure dey
axiosInstance.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// hook er baire (useRole er moto jaygay) use korar jonno
export const axiosSecure = axiosInstance;

export default function useAxiosSecureToken() {
  const { logOut } = useAuth();

  // response interceptor: token invalid (401) hole logout
  useEffect(() => {
    const id = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          logOut();
        }
        return Promise.reject(error);
      }
    );

    // component bondho hole interceptor muche dei, noile jomte thake
    return () => axiosInstance.interceptors.response.eject(id);
  }, [logOut]);

  return axiosInstance;
}