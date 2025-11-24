/* eslint-disable react/jsx-props-no-spreading */
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

export default function Register() {
  // Simple state management for Register fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState("");

  const [errors, setErrors] = useState("");

  // Once the account is registered, log the user into the AuthContext
  const { login } = useAuth();
  // Tanstack mutation hook for registering user
  const { mutate: registerAccount, isPending } = useRegisterUser();

  // Get skills for dropdown menu
  const { data: skills = [], isLoading: skillsLoading } = useAllSkills();

  // Password Regex rules: 1 uppercase, one lowercase, one number, one special symbol, 8 char length
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  // What runs when the form is submitted and valid (handleSubmit automatically checks validation rules):
  const validateAndSubmit = () => {
    const newErrors = {};

    if (!username.trim()) newErrors.username = "Username is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Please enter a valid email";
    if (!password) newErrors.password = "Password is required";
    else if (!passwordRegex.text(password))
      newErrors.password =
        "Password must be at least 8 characters and contain: one uppercase, one lowercase, one number, one special character";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!selectedSkillId) newErrors.skill = "Please select your skill level";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      registerAccount(
        {
          username,
          password,
          email,
          first_name: firstName,
          last_name: lastName || null,
          skill_level_id: Number(selectedSkillId),
        },
        {
          onSuccess: (response) => {
            login(response["Authentication Bearer token"]);
          },
          onError: (response) => {
            Alert.alert("Registration Failed", response.message);
          },
        }
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Your Account</Text>
      <Text style={styles.subtitle}>Start logging your climbs today!</Text>

      {/* Username */}
      <View style={styles.formField}>
        <Text style={styles.label}>Username: </Text>
        <TextInput
          style={[styles.formInput, errors.username && styles.inputError]}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoComplete="username"
        />
        {errors.username && <Text style={styles.errorMessage}>{errors.username}</Text>}
      </View>

      {/* Email */}
      <View style={styles.formField}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          styles={[styles.formInput, errors.email && styles.inputError]}
          placeholder="Enter your email..."
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        {errors.email && <Text style={styles.errorMessage}>{errors.email}</Text>}
      </View>

      {/* Names */}
      <View style={styles.formField}>
        <Text style={styles.label}>First/Given name: </Text>
        <TextInput
          style={[styles.formInput, errors.firstName && styles.inputError]}
          placeholder="Enter your first or given name..."
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
        />
        {errors.firstName && <Text styles={styles.errorMessage}>{errors.firstName}</Text>}
      </View>

      <View>
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
      <View style={[styles.pickerWrapper, errors.skill && styles.inputError]}>
        <Picker
          selectedValue={selectedSkillId}
          onValueChange={setSelectedSkillId}
          enabled={!skillsLoading}
          style={styles.picker}
        >
          <Picker.Item label="Select your skill level..." value="" />
          {skills.map((skill) => (
            <Picker.Item
              key={skill.id}
              label={`${skill.level} - ${skill.description.substring(0, 60)}...`}
              value={skill.id}
            />
          ))}
        </Picker>
        {errors.skill && <Text style={styles.errorMessage}>{errors.skill}</Text>}
      </View>

      {/* Password */}
      <View>
        <Text style={styles.label}>Password: </Text>
        <TextInput
          styles={[styles.formInput, errors.password && styles.inputError]}
          placeholder="Enter your password..."
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password-new"
        />
        {errors.password && <Text style={styles.errorMessage}>{errors.password}</Text>}
      </View>

      {/* Confirm Password */}
      <View>
        <Text style={styles.label}>Confirm Password: </Text>
        <TextInput
          style={[styles.formInput, errors.confirmPassword && styles.inputError]}
          placeholder="Re-enter your password..."
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {errors.confirmPassword && (
          <Text style={styles.errorMessage}>{errors.confirmPassword}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isPending && styles.buttonLoading]}
        onPress={validateAndSubmit}
        disabled={isPending}
      >
        <Text style={styles.buttonText}>{isPending ? "Creating your account..." : "Register"}</Text>
      </TouchableOpacity>
    </ScrollView>
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
  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    backgroundColor: "white",
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
});
