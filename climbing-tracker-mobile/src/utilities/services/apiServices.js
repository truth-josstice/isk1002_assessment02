import axios from "axios";

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
/*
api.interceptors.request.use((config) => {
    const token = await EncryptedStorage.getItemAsync('jwt');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    })
    return config;
*/

export const registerUser = async (userBodyData) =>
  callApi(() => api.post("/register", userBodyData), "Error registering user");

export const loginUser = async (userBodyData) =>
  callApi(() => api.post("/login", userBodyData), "Error logging in");

export const getClimbs = async () =>
  callApi(() => api.get("/climbs"), "Error fetching climbs");

export const createClimb = async (climbData) =>
  callApi(() => api.post("/climbs", climbData), "Error creating climb");

export const createAttempt = async (climbId, attemptData) =>
  callApi(
    () => api.post(`/climbs/${climbId}/attempts`, attemptData),
    "Error adding attempt"
  );

export const getStyles = async () =>
  callAPI(() => api.get("/learn/styles"), "Error retrieving styles");

export const getSkills = async () =>
  callAPI(() => api.get("/learn/skills"), "Error retrieving skills");
