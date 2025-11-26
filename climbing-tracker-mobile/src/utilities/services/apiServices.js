import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Set up const variable for API URL using process.env (Expo does not use import.meta like a React web project does)
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://127.0.0.1:5000";

// Set up instance of axios with customised content type, timeout (8000 more suited to mobile applications), and dynamic API_URL
const api = axios.create({
  baseURL: API_URL,
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

const callApi = async (apiCall, errorMessage = "Something went wrong") => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    console.error(errorMessage, error.response?.data || error.message);
    throw error.response?.data || { message: errorMessage };
  }
};

// Authorisation token interceptor, runs on all routes with securely stored token
// NOTE: Expo SecureStorage is asynchronous, so this function must be async
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("jwt");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("Error retrieving token from SecureStore:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle 401 Unauthorized responses. Original tokens are short lived
// and do not refresh for simple development. This will ensure Login is always required
// when tokens are invalid or expired.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("jwt");
      
      if(typeof window !== "undefined") {
        window.dispatchEvent(new Event("authenticationExpired"));
      }
    }
    return Promise.reject(error);
  }
);

export const registerUser = async (userBodyData) =>
  callApi(() => api.post("/register", userBodyData), "Error registering user");

export const loginUser = async (userBodyData) =>
  callApi(() => api.post("/login", userBodyData), "Error logging in");

export const getClimbs = async () => callApi(() => api.get("/climbs"), "Error fetching climbs");

export const createClimb = async (climbData) =>
  callApi(() => api.post("/climbs", climbData), "Error creating climb");

export const getAttempts = async () =>
  callApi(() => api.get("/attempts"), "Error fetching attempts");

export const createAttempt = async (climbId, attemptData) =>
  callApi(() => api.post(`/climbs/${climbId}/attempts`, attemptData), "Error adding attempt");

export const getStyles = async () =>
  callApi(() => api.get("/learn/styles"), "Error retrieving styles");

export const getSkills = async () =>
  callApi(() => api.get("/learn/skills"), "Error retrieving skills");
