/* 
AddClimbScreen
Purpose: Allows authenticated users to add climbs to the application, available to any authenticated user, a design choice
made to ensure users can use any existing climbs, or add climbs if they don't agree with the style choices. Bouldering is
very subjective!

Features: 
- Individual state based control for form/picker input, could useReduce if form data grows in future development
- Validation of forms to match backend requirements for instant user feedback:
  - Selected gym: foreign key, required
  - Selected style: foreign key, required
  - Set date: not required, but set to default to today's date to avoid Unix Epoch errors (1970-01-01)
- Simple back navigation to return to HomeScreen
*/

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import { useAllStyles } from "../../utilities/customHooks/useInfo";
import { useAllGyms } from "../../utilities/customHooks/useGyms";
import { useAddClimb } from "../../utilities/customHooks/useClimbs";
import { useAuth } from "../../context/AuthContext";

import { getTodayDate } from "../../utilities/helpers/getTodayDate";

// Accepts navigation props from AppContent parent component
export default function AddClimbScreen({ onNavigateToHome }) {
  // Current user is obtained from AuthContext
  const { user } = useAuth();

  // Gym data is an array of objects, fallback to blank array as failsafe
  const { data: gyms = [], isLoading: gymsLoading } = useAllGyms();

  // Style data is array of objects, fallback to a blank array as failsafe
  const { data: climbStyles = [], isLoading: stylesLoading } = useAllStyles();

  // Add climb Tanstack Query mutation
  const { mutate: addClimb, isPending } = useAddClimb();

  // Simple state management for form data passed to useAddClimb Tanstack Query mutation
  const [selectedGymId, setSelectedGymId] = useState("");
  const [selectedStyleId, setSelectedStyleId] = useState("");
  const [difficultyGrade, setDifficultyGrade] = useState("");
  const [setDate, setSetDate] = useState("");

  // Error state management for any validation errors - remove once validation succeeds
  const [errors, setErrors] = useState({});

  // Validation rules for all form inputs
  const validateForm = () => {
    // Create blank error object for any validation errors
    const newErrors = {};

    // Gym: required
    if (!selectedGymId) newErrors.gym = "Please select a gym";

    // Style: required
    if (!selectedStyleId) newErrors.style = "Please select a style";

    // Difficulty grade: required
    if (!difficultyGrade.trim()) newErrors.grade = "Please enter a difficulty grade";

    // Attach validation errors to the newErrors object
    setErrors(newErrors);

    // Return once the newErrors object contains 0 errors
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = () => {
    // IF form has invalid data, return early
    if (!validateForm()) return;

    // Form data to attach to the useRegisterUser mutation
    const climbData = {
      gym_id: parseInt(selectedGymId), // Ensure the gym ID is an INT not a STRING
      style_id: parseInt(selectedStyleId), // Ensure the style ID is an INT not a STRING
      difficulty_grade: difficultyGrade,
      user_id: user.id, // Obtain user.id from AuthContext current user
      set_date: setDate.trim() || getTodayDate(), // Helper function for correct formatting of today's date
    };

    // Tanstack Query Mutation function
    // - Data preparation with validation
    // - Mutation call with success/error handling
    // - Navigation on success, user feedback on error
    addClimb(climbData, {
      onSuccess: () => {
        Alert.alert("Success", "Climb added successfully!");
        onNavigateToHome(); // Navigate back to home page upon success
      },
      onError: (error) => {
        console.error("Error adding climb:", error); // Log any errors received
        Alert.alert("Error", "Failed to add climb. Please try again."); // Alert the user to the error
      },
    });
  };

  // IF either gyms or styles are still loading, show an ActivityIndicator
  if (gymsLoading || stylesLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    // ScrollView container for the entire form if needed
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Add New Climb</Text>

      {/* Gym Picker */}
      <View
        style={[styles.formField, errors.gym && styles.inputError]} // Conditional styling to highlight any input errors
      >
        <Text style={styles.label}>Gym:</Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedGymId}
            onValueChange={setSelectedGymId}
            style={styles.picker}
          >
            {/* Default select a gym picker item */}
            <Picker.Item label="Select a gym..." value="" />

            {/* Map using formatted string helper function for each picker item */}
            {gyms.map((gym) => (
              <Picker.Item key={gym.id} label={`${gym.name} - ${gym.city}`} value={gym.id.toString()} />
            ))}
          </Picker>
        </View>
        {/* Conditionally render any error messages */}
        {errors.gym && <Text style={styles.errorMessage}>{errors.gym}</Text>}
      </View>

      {/* Style Picker */}
      <View
        style={[styles.formField, errors.style && styles.inputError]} // Conditional styling to highlight any input errors
      >
        <Text style={styles.label}>Climbing Style:</Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedStyleId}
            onValueChange={setSelectedStyleId}
            style={styles.picker}
          >
            {/* Default picker item */}
            <Picker.Item label="Select a style..." value="" />

            {/* Map climb data to each dropdown item */}
            {climbStyles.map((style) => (
              <Picker.Item
                key={style.id}
                label={`${style.name} - ${style.description}`}
                value={style.id.toString()}
              />
            ))}
          </Picker>
        </View>

        {/* Conditionally render any error messages */}
        {errors.style && <Text style={styles.errorMessage}>{errors.style}</Text>}
      </View>

      {/* Difficulty Grade Input */}
      <View style={[styles.formField, errors.grade && styles.inputError]}>
        <Text style={styles.label}>Difficulty Grade:</Text>
        <TextInput
          style={styles.textInput}
          value={difficultyGrade}
          onChangeText={setDifficultyGrade}
          placeholder="e.g., V4, 5.10a, 6a+, Purple, Red etc"
        />
        <Text style={styles.infoText}>
          Different gyms have different ratings, use whichever you like most!
        </Text>
      </View>

      {/* Set Date Input (Optional) */}
      <View style={styles.formField}>
        <Text style={styles.label}>Set Date: </Text>
        <TextInput
          style={styles.textInput}
          value={setDate}
          onChangeText={setSetDate}
          placeholder={`${getTodayDate()} (or manually enter YYYY-MM-DD)`} // Shows users what will be entered by default, and the correct format for date entry
        />
        <Text style={styles.infoText}>Leave blank if unknown</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>

        {/* Cancel Button - Navigates to Home Screen */}
        <TouchableOpacity
          onPress={onNavigateToHome}
          style={[styles.button, styles.cancelButton]}
          disabled={isPending}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.button, styles.submitButton]}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Add Climb</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Climb Screen styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b7c4d2ff",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  formField: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "white",
  },
  picker: {
    backgroundColor: "white",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "white",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorMessage: {
    color: "#ef4444",
    fontSize: 14,
    marginTop: 4,
  },
  infoText: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#6b7280",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#2563eb",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
});
