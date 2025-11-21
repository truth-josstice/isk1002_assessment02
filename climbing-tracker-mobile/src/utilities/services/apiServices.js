import axios from "axios";

// Set up const variable for API URL using process.env (Expo does not use import.meta like a React web project does)
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://127.0.0.1:3000";

// Set up instance of axios with customised content type, timeout (8000 more suited to mobile applications), and dynamic API_URL
const api = axios.create({
  baseURL: API_URL,
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

// Reusable wrapper so we don't have to repeat try-catch in every api call
const callApi = async (fn, errMsg) => {
  try {
    const res = await fn();
    return res.data;
  } catch (err) {
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

// Api POST request to /register auth route to register a new user
export const registerUser = async (userBodyData) =>
  callApi(() => api.post("/register", userBodyData), "Error registering user");

// Api POST route to login with valid credentials
export const loginUser = async (userBodyData) =>
  callApi(() => api.post("/login", userBodyData), "Error logging in");

// Api GET route to get all user associated climbs
export const getClimbs = async () =>
  callApi(() => api.get("/climbs"), "Error fetching climbs");

// Api POST route to create/log a new climb
export const createClimb = async (climbData) =>
  callApi(() => api.post("/climbs", climbData), "Error creating climb");

// Api POST route to create a new attempt on a climb
export const createAttempt = async (climbId, attemptData) =>
  callApi(
    () => api.post(`/climbs/${climbId}/attempts`, attemptData),
    "Error adding attempt"
  );

// Api GET route to get all skill level data for account creation UI
export const getSkills = async () =>
  callApi(() => api.get("/learn/skills"), "Error fetching skills");

// Api GET route to get all styles for climb creation UI
export const getStyles = async () =>
  callApi(() => api.get("/learn/styles"), "Error fetching styles");
