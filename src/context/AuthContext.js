/* 
Authorisation Context Manager
Purpose: Manages user authentication and authorisation, attaches user object and selectively decodes payload when parameters are necessary.
- Manages setting the current user using API response tokens stored in Expo SecureStore
- Manages removal of token from SecureStore for expired tokens, and on logout requests
- Loads in tokens available in Expo SecureStore and checks if they are valid before displaying the home screen, reducing API errors and unnecessary requests
- Client-side decoding of JWT requires only selected user information
- Allows user details (username, id) to be passed to components and API requests where required
- Passes login, logout, isAuthenticated, isLoading to child components
*/

import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Alert, DeviceEventEmitter } from "react-native";

// Set up blank context object
const AuthContext = createContext({});

// Manually decode the JWT token client-side
const decodeJwt = (token) => {
  try {
    const payload = token.split(".")[1]; // JWT format: header.payload.signature. Take only the payload.
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))); // Parse the token using 64 bit encryption
  } catch (err) {
    return null; // If any errors occur (invalid token data) return no data
  }
};

// Check if token has expired based on it's encoded exp (expiry) claim
const isTokenExpired = (token) => {
  try {
    // First decode the token payload
    const payload = decodeJwt(token);

    // If there is no token payload or exp claim (corrupt or malformed token data) return token as expired
    if (!payload || !payload.exp) return true;

    // Convert expiry to milliseconds (JWT expiry is in seconds since Unix epoch)
    const expiryInMs = payload.exp * 1000;
    const now = Date.now();

    // Check if current time is passed expiry time (with 5 second grace period for network delay)
    return now >= expiryInMs - 5000;
  } catch (error) {
    return true; // if ANY errors occur, return token as expired
  }
};

// Create an Authorisation Provider to pass user state and loading state to child components
export const AuthProvider = ({ children }) => {
  // User management state attaches token to user object
  const [user, setUser] = useState(null);

  // Simple loading state
  const [isLoading, setIsLoading] = useState(true);

  // Effect to handle invalid or expired tokens across the application
  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null); // Automatically removes token, and refreshes to login page
      Alert.alert(
        "Session Expired",
        "Your login session has expired. Please sign in again to continue.",
        [{ text: "OK" }]
      );
    };

    // Event listeners are handled by DeviceEventEmitter in React-Native
    // Define a subscription(event) for expired tokens
    const subscription = DeviceEventEmitter.addListener("authenticationExpired", handleAuthExpired);

    return () => {
      subscription.remove(); // Once the event listener function has been called, remove the authenticationExpired event
    };
  }, []);

  // Load token on app start, and check if the token is expired before any further API requests/components are loaded
  useEffect(() => {
    // Define loadToken function (load any existing tokens in SecureStore)
    const loadToken = async () => {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync("jwt");

      // Existing token flow: token -> isTokenExpired -> setUser/setUser(null)
      if (token) {
        if (isTokenExpired(token)) {
          setUser(null);
        } else {
          const payload = decodeJwt(token);
          if (payload) {
            setUser({
              token,
              username: payload.username,
              id: parseInt(payload.sub), // Convert string ID to number
            });
          } else {
            setUser(null);
          }
        }
      }
      // Once token has been checked, remove loading state to render child components
      setIsLoading(false);
    };
    // Call the loadToken function
    loadToken();
  }, []);

  // On login, attach the token in SecureStore to the user state
  const login = async (token) => {
    await SecureStore.setItemAsync("jwt", token);
    const payload = decodeJwt(token);
    setUser({ token, username: payload.username, id: payload.sub });
  };

  // On logout, remove the token from the SecureStore and setUser to null (automatically navigates to login screen)
  const logout = async () => {
    await SecureStore.deleteItemAsync("jwt");
    setUser(null);
  };

  // Return the Context provider and all associated Auth parameters
  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the complete context function for use across authorised routes
export const useAuth = () => useContext(AuthContext);
