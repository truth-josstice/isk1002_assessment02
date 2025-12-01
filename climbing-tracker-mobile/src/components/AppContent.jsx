import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/login/Login";
import HomeScreen from "../screens/home/Home";
import Register from "../screens/register/Register";

export default function AppContent() {
  const { user } = useAuth();
  const [currentScreen, setCurrentScreen] = useState("login");

  console.log("AuthGate render — user:", user);

  // If user is Authenticated
  if (user) {
    switch (currentScreen) {
      case "home":
        return (
          <HomeScreen
            onNavigateToAddClimb={() => setCurrentScreen("addClimb")}
            onNavigateToAddAttempt={() => setCurrentScreen("addAttempt")}
          />
        );
      case "addClimb":
        return <AddClimbScreen onNavigateToHome={() => setCurrentScreen("home")} />;
      case "addAttempt":
        return <AddAttemptScreen onNavigateToHome={() => setCurrentScreen("home")} />;
      default:
        return (
          <HomeScreen
            onNavigateToAddClimb={() => setCurrentScreen("addClimb")}
            onNavigateToAddAttempt={() => setCurrentScreen("addAttempt")}
          />
        );
    }
  }

  // IF user is NOT authenticated
  switch (currentScreen) {
    case "login":
      return <LoginScreen onNavigateToRegister={() => setCurrentScreen("register")} />;
    case "register":
      return <Register onNavigateToLogin={() => setCurrentScreen("login")} />;
    default:
      return <LoginScreen onNavigateToRegister={() => setCurrentScreen("register")} />;
  }
}
