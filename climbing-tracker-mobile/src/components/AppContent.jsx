import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/login/Login";
import HomeScreen from "../screens/home/Home";
import Register from "../screens/register/Register";
import AddClimbScreen from "../screens/add-climb/AddClimb";
import AddAttemptScreen from "../screens/add-attempt/AddAttempt";

export default function AppContent() {
  const { user } = useAuth();
  const [currentScreen, setCurrentScreen] = useState("login");
  const [selectedClimb, setSelectedClimb] = useState(null);

  console.log("AuthGate render — user:", user);

  // If user is Authenticated
  if (user) {
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
            climb={selectedClimb}
            onNavigateToHome={() => {
              setSelectedClimb(null);
              setCurrentScreen("home");
            }}
          />
        );
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
