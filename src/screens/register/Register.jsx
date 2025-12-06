/* 
Register Screen
Purpose: Allows new users to register an account to use authorised features of the application.
Features: 
- State management for form/picker fields to attach to register request
- Client side validation of all form/picker fields to attach to register request for instant user feedback:
  - Username: required
  - Email: required, correct email format
  - Password: complexity requirements
  - Password confirmation: must match password
  - First Name: required
  - Skill level: ENUM, required
- Attaches newly registered user to Authorisation Context

Security notes:
- Passwords are never stored in plain text, and never sent in responses from API
- SecureText fields hide password input
- Token storage handled by AuthContext/SecureStore
*/ 


import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../../context/AuthContext";
import { useRegisterUser } from "../../utilities/customHooks/useAuth";
import { useAllSkills } from "../../utilities/customHooks/useInfo";

export default function RegisterScreen({ onNavigateToLogin }) {
  // Simple state management for Register fields
  // Using individual useState for form simplicity (could useReducer for more complicated/longer forms)
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState("");

  // Blank error object for validation errors - Cleared on successful validation
  const [errors, setErrors] = useState({});

  // Once the account is registered, log the user into the AuthContext
  const { login } = useAuth();
  // Tanstack mutation hook for registering user
  const { mutate: registerAccount, isPending } = useRegisterUser();

  // Get skills for dropdown menu
  const { data: skills = [], isLoading: skillsLoading } = useAllSkills();

  // Password Regex rules: 1 uppercase, one lowercase, one number, one special symbol, 8 char length
  // Complexity matches backend complexity requirements
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  // What runs when the form is submitted and valid (handleSubmit automatically checks validation rules):
  const validateAndSubmit = () => {
    const newErrors = {};

    // Username validation: username is required
    if (!username.trim()) newErrors.username = "Username is required";

    // Email requirements: email is required, and must be valid email format
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Please enter a valid email";

    // Password requirements: password is required, must meet complexity standards matching the backend
    if (!password) newErrors.password = "Password is required";
    else if (!passwordRegex.test(password))
      newErrors.password =
        "Password must be at least 8 characters and contain: one uppercase, one lowercase, one number, one special character";

    // Users must confirm password
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    // Skill level requirements: skill level is required
    if (!selectedSkillId) newErrors.skill = "Please select your skill level";

    // Update the error object with any errors which have occurred
    setErrors(newErrors);

    // If there are NO errors in newErrors object, proceed to mutation function
    if (Object.keys(newErrors).length === 0) {
      // The actual mutation function occurs here with data from the form:
      registerAccount(
        {
          username,
          password,
          email,
          first_name: firstName, // Match the SQL model first_name
          ...(lastName && { last_name: lastName }), // IF last name is provided use it, otherwise do not provide an empty string
          skill_level_id: Number(selectedSkillId), // Ensure selected skill ID is converted to a number
        },

        // Success management:
        {
          onSuccess: (response) => {
            login(response.access_token); // Set the current user using the response token
          },
          onError: (response) => {
            Alert.alert("Registration Failed", response.message); // Respond with the API error message (response.message)
          },
        }
      );
    }
  };

  return (
    // Container for the entire register screen
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Your Account</Text>
      <Text style={styles.subtitle}>Start logging your climbs today!</Text>

      {/* Username */}
      <View style={styles.formField}>
        <Text style={styles.label}>Username: </Text>
        <TextInput
          style={[styles.formInput, errors.username && styles.inputError]} // Conditional styling to highlight errors
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoComplete="username"
        />
        {/* Conditionally display error messages */}
        {errors.username && <Text style={styles.errorMessage}>{errors.username}</Text>}
      </View>

      {/* Email */}
      <View style={styles.formField}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={[styles.formInput, errors.email && styles.inputError]} // Conditional styling to highlight errors
          placeholder="Enter your email..."
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address" // Mobile optimised keyboard layout
          autoComplete="email"
        />
        {/* Conditionally display error messages */}
        {errors.email && <Text style={styles.errorMessage}>{errors.email}</Text>}
      </View>

      {/* First/Given name */}
      <View style={styles.formField}>
        <Text style={styles.label}>First/Given name: </Text>
        <TextInput
          style={[styles.formInput, errors.firstName && styles.inputError]} // Conditional styling to highlight errors
          placeholder="Enter your first or given name..."
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words" // Capitalise any lowercase words
        />
        {/* Conditionally display error messages */}
        {errors.firstName && <Text styles={styles.errorMessage}>{errors.firstName}</Text>}
      </View>

      {/* Last/Family Name (Optional) */}
      <View style={styles.formField}>
        <Text style={styles.label}>Last/Family name: </Text>
        <TextInput
          style={styles.formInput}
          placeholder="Last or family name is optional..."
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
        />
      </View>

      {/* Skill Level Dropdown */}
      <View style={[styles.formField, errors.skill && styles.inputError]}>
        <Text style={styles.label}>Skill Level:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedSkillId}
            onValueChange={setSelectedSkillId}
            enabled={!skillsLoading} // Only enable if skills are not loading
            style={styles.picker}
          >
            {/* Default drop down choice */}
            <Picker.Item label="Select your skill level..." value="" />
            {/* Picker items mapped from useAllSkills customHook */}
            {skills.map((skill) => (
              <Picker.Item
                key={skill.id}
                label={`${skill.level} - ${skill.description.substring(0, 60)}...`} // Capped characters at 60 for mobile first design
                value={skill.id}
              />
            ))}
          </Picker>
        </View>
        {/* Conditionally display error messages */}
        {errors.skill && <Text style={styles.errorMessage}>{errors.skill}</Text>}
      </View>

      {/* Password */}
      <View style={styles.formField}>
        <Text style={styles.label}>Password: </Text>
        <TextInput
          style={[styles.formInput, errors.password && styles.inputError]} // Conditional styling to highlight errors
          placeholder="Enter your password..."
          value={password}
          onChangeText={setPassword}
          secureTextEntry // Ensures passwords are not visible when being entered
          autoComplete="password-new"
        />
        {/* Conditionally display error messages */}
        {errors.password && <Text style={styles.errorMessage}>{errors.password}</Text>}
      </View>

      {/* Confirm Password */}
      <View style={styles.formField}>
        <Text style={styles.label}>Confirm Password: </Text>
        <TextInput
          style={[styles.formInput, errors.confirmPassword && styles.inputError]}
          placeholder="Re-enter your password..."
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry // Ensures passwords are not visible when being entered
        />
        {/* Conditionally display error messages */}
        {errors.confirmPassword && (
          <Text style={styles.errorMessage}>{errors.confirmPassword}</Text>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isPending && styles.buttonLoading]} // Conditional styling to show pending state
        onPress={validateAndSubmit} // Runs validation and submit handler for all form data
        disabled={isPending} // Cannot be clicked while pending to avoid duplicate submissions
      >
        {/* Conditionally display button text for strong UX */}
        <Text style={styles.buttonText}>{isPending ? "Creating your account..." : "Register"}</Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.secondaryButton} onPress={onNavigateToLogin}> 
        <Text style={styles.secondaryButtonText}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Register Screen styling
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#b7c4d2ff",
    padding: 32,
  },
  title: {
    marginTop: 32,
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#0f172a",
  },
  subtitle: {
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
  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    backgroundColor: "white",
  },
  inputError: { borderColor: "#ef4444" },
  errorMessage: { color: "#ef4444", marginTop: 4, marginLeft: 4 },
  submitButton: {
    marginTop: 16,
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
    marginBottom: 32,
  },
  secondaryButtonText: {
    color: "#2563eb",
    fontSize: 16,
    fontWeight: "500",
  },
});
