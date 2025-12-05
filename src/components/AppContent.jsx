/* 
Custom Navigation Controller
Purpose: To control the conditional rendering of screens through react state management, as an alternative to React-Native
and React-Native-Stack navigation which had compatibility issues with Expo SDK 51 on Android (java.lang.bool parsing errors):

Architecture:
- Uses React state to manage currentScreen and navigation parameters
- Passes selectedClimb for attempts as a prop to AddAttemptScreen
- Integrates AuthContext for authorisation and authentication
*/

import { useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

// useAuth handles our current-user, enabling us to default to Home Screen if user is logged in and did not manually log out
import { useAuth } from "../context/AuthContext";

// Import all screens to be used based on currentScreen state
import LoginScreen from "../screens/login/Login";
import RegisterScreen from "../screens/register/Register";
import HomeScreen from "../screens/home/Home";
import AddClimbScreen from "../screens/add-climb/AddClimb";
import AddAttemptScreen from "../screens/add-attempt/AddAttempt";

export default function AppContent() {
  // Create a user object to represent the current-user
  const { user, isLoading } = useAuth();

  // useState navigation: currentScreen controls which screen components are rendered
  const [currentScreen, setCurrentScreen] = useState("login");

  // useState climb selection: selectedClimb is set to null by default as no climb will have been selected
  const [selectedClimb, setSelectedClimb] = useState(null);

  // Loading state for user object while AuthContext validates stored token
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  // Authenticated user flow
  if (user) {
    // Switch and case matches to control rendered AppContent
    switch (currentScreen) {
      case "home":
        return (
          <HomeScreen
            onNavigateToAddClimb={() => setCurrentScreen("addClimb")}
            onNavigateToAddAttempt={(climb) => {
              setSelectedClimb(climb);
              setCurrentScreen("addAttempt");
            }}
          />
        );

      case "addClimb":
        return <AddClimbScreen onNavigateToHome={() => setCurrentScreen("home")} />;

      case "addAttempt":
        return (
          <AddAttemptScreen
            climb={selectedClimb} // Pass the selectedClimb as a parameter
            onNavigateToHome={() => {
              setSelectedClimb(null); // Reset selectedClimb when navigating back to home
              setCurrentScreen("home"); // Set currentScreen to "home"
            }}
          />
        );

      // Default case is home for logged in and valid tokens
      default:
        return (
          <HomeScreen
            onNavigateToAddClimb={() => setCurrentScreen("addClimb")}
            onNavigateToAddAttempt={(climb) => {
              setSelectedClimb(climb);
              setCurrentScreen("addAttempt");
            }}
          />
        );
    }
  }

  // Unauthenticated user flow (login/register)
  switch (currentScreen) {
    case "login":
      return <LoginScreen onNavigateToRegister={() => setCurrentScreen("register")} />;
    
    case "register":
      return <RegisterScreen onNavigateToLogin={() => setCurrentScreen("login")} />;
    
    default:
      return <LoginScreen onNavigateToRegister={() => setCurrentScreen("register")} />;
  }
}

// Loading screen styles
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#b7c4d2ff",
  },
  loadingText: {
    marginTop: 24,
    fontSize: 16,
    color: "#64748b",
  },
});
