/*
Axios API Request Manager
Purpose: Creation and management of all API requests across the application
- Uniform request/response format across all API calls
- Interceptor automatically attaches token to all requests
- Interceptor manages what occurs when API responds with 401 (invalid token): automatic token cleanup with message
- Consistent error handling and logging
- Automatic Content-Type control for all api requests 
- Attachment of correct URI based on dev or prod environment
- Mobile specific timeout settings for variable connectivity
*/

import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { DeviceEventEmitter } from "react-native";

// Set up const variable for API URL using process.env (Expo does not use import.meta like a React web project does)
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://127.0.0.1:5000";

// Set up instance of axios with customised content type, timeout (8000 more suited to mobile applications), and dynamic API_URL
const api = axios.create({
  baseURL: API_URL,
  timeout: 8000, // Higher timeout for mobile applications due to network connectivity inconsistency
  headers: { "Content-Type": "application/json" },
});

// Wrapper function for consistent error handling across all API calls
const callApi = async (apiCall, errorMessage = "Something went wrong") => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    console.error(errorMessage, error.response?.data || error.message);
    throw error.response?.data || { message: errorMessage }; // Returns API error message if available, otherwise generic message
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

      // React Native does not have window objects, this prevents web-specific errors
      if (typeof window !== "undefined") {
        DeviceEventEmitter.emit("authenticationExpired");
      }
    }
    return Promise.reject(error);
  }
);

// Authentication endpoints
export const registerUser = async (userBodyData) =>
  callApi(() => api.post("/register", userBodyData), "Error registering user");

export const loginUser = async (userBodyData) =>
  callApi(() => api.post("/login", userBodyData), "Error logging in");

// Climb Endpoints
export const getClimbs = async () => callApi(() => api.get("/climbs"), "Error fetching climbs");

export const createClimb = async (climbData) =>
  callApi(() => api.post("/climbs", climbData), "Error creating climb");

// Attempt Endpoints
export const getAttempts = async () =>
  callApi(() => api.get("/attempts"), "Error fetching attempts");

export const createAttempt = async (attemptData) =>
  callApi(() => api.post(`/attempts`, attemptData), "Error adding attempt");

// Info/Reference Data Endpoints
export const getStyles = async () =>
  callApi(() => api.get("/learn/styles"), "Error retrieving styles");

export const getSkills = async () =>
  callApi(() => api.get("/learn/skills"), "Error retrieving skills");

export const getGyms = async () => 
  callApi(() => api.get("/gyms"), "Error retrieving gyms");
