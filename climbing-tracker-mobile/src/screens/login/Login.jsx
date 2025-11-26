/* 
Purpose: Secure authentication screen which uses client-side validation to ensure no unnecessary API calls are made
integrated with Flask JWT-Extended backend via Tanstack Query mutation and Axios api request.
Key Decisions: 
- Conditional rendering of content via AuthContext (React Navigation led to SDK 51 Android errors)
- Client-side validation reduces server load
- Custom hook useLoginUser abstracts axios and react-query logic
*/

import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext.js";
import { useLoginUser } from "../../utilities/customHooks/useAuth.js";

export default function LoginScreen({ onNavigateToRegister }) {
  // Simple state management for Login fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Simple state management for input errors
  const [errors, setErrors] = useState({});

  // Use login const from AuthContext provider to set the current user
  const { login } = useAuth();

  // Use Tanstack react query custom hook useLoginUser to make axios api.post login route request
  const { mutate: apiLogin, isPending } = useLoginUser();

  // Simple validation handler for input fields for user login match back end requirements
  const validateAndSubmit = () => {
    // Create a blank error object for any encountered errors
    const newErrors = {};
    // If there is no username:
    if (!username.trim()) newErrors.username = "Username is required";
    // IF there is no password
    if (!password) newErrors.password = "Password is required";
    // IF there is a password, but it's not long enough
    if (password && password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    // Add errors to the blank error object
    setErrors(newErrors);

    // ONLY run the actual login mutation if there are no errors
    if (Object.keys(newErrors).length === 0) {
      // The actual mutation function
      apiLogin(
        // Uses username and password state values
        { username, password },

        // On successful api request
        {
          onSuccess: (response) => {
            // attach the token using the AuthContext function
            login(response["Authentication Bearer token"]);
          },
          // On api errors: return error response message
          onError: (response) => Alert.alert("Login Failed", response.message),
        }
      );
    }
  };

  return (
    // Adjusted from previous assessment using correct react-native semantics
    <View style={styles.container}>
      <Text style={styles.title}> Welcome Back! </Text>
      <Text style={styles.legend}>Login to your climbing log!</Text>

      {/* The username field */}
      <View style={styles.formField}>
        <Text style={styles.label}>Username: </Text>
        <TextInput
          style={[styles.formInput, errors.username && styles.inputError]} // red error outline when errors occur with dynamic styling
          placeholder="Enter your username..." // Placeholder in the field before entry
          autoCapitalize="none" // Remove any capitals in the username field
          autoComplete="username" // Will attempt to use any existing usernames if known
          value={username} // The value passed to the mutation for username
          onChangeText={setUsername} // Changes the username field's set value any time the text is changed
        />
        {/* Present an error message when validation rules are broken  */}
        {errors.username && <Text style={styles.errorMessage}>{errors.username}</Text>}
      </View>

      {/* The password field */}
      <View style={styles.formField}>
        <Text style={styles.label}>Password: </Text>
        <TextInput
          style={[styles.formInput, errors.password && styles.inputError]}
          placeholder="Enter your password..."
          secureTextEntry // Ensures the password is NOT visible when being entered (standard security practice)
          value={password}
          onChangeText={setPassword}
        />
        {errors.password && <Text style={styles.errorMessage}>{errors.password}</Text>}
      </View>

      {/* TouchableOpacity is the same as button in semantic html */}
      <TouchableOpacity
        style={[styles.submitButton, isPending && styles.buttonLoading]}
        onPress={validateAndSubmit}
        disabled={isPending}
      >
        <Text style={styles.buttonText}> {isPending ? "Signing in..." : "Sign in"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={onNavigateToRegister}>
        <Text style={styles.secondaryButtonText}>Don't have an account? Sign up!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 32,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#0f172a",
  },
  legend: {
    fontSize: 18,
    textAlign: "center",
    color: "#64748b",
    marginBottom: 32,
  },
  formField: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: "500", color: "#0f172a", marginBottom: 8 },
  formInput: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  inputError: { borderColor: "#ef4444" },
  errorMessage: { color: "#ef4444", marginTop: 4, marginLeft: 4 },
  submitButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonLoading: { backgroundColor: "#93c5fd" },
  buttonText: { color: "white", fontSize: 18, fontWeight: "600" },
  secondaryButton: {
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  secondaryButtonText: {
    color: "#2563eb",
    fontSize: 16,
    fontWeight: "500",
  },
});
