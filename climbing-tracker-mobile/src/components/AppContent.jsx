import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "../pages/login/Login";
import HomeScreen from "../pages/home/Home";
import Register from "../pages/register/Register";

export default function AppContent() {
  const { user } = useAuth();
  const [currentScreen, setCurrentScreen] = useState("login");

  console.log("AuthGate render — user:", user);

  // If user is Authenticated
  if (user) {
    return <HomeScreen />;
  }

  switch (currentScreen) {
    case "login":
      return <LoginScreen onNavigateToRegister={() => setCurrentScreen("register")} />;
    case "register":
      return <Register onNavigateToLogin={() => setCurrentScreen("login")} />;
    default:
      return <LoginScreen onNavigateToRegister={() => setCurrentScreen("register")} />;
  }
}
