import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Welcome back, {user?.username || "User"}!
      </Text>

      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc" },
  welcome: { fontSize: 28, fontWeight: "700", marginBottom: 40, color: "#0f172a" },
  logoutButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  logoutText: { color: "white", fontSize: 18, fontWeight: "600" },
});
