/* 
AddAttemptScreen
Purpose: Allows authenticated users to add attempts on any existing climbs

Features:
- Simple state management for form/rating inputs - could upgrade to useReducer if forms become more complex in later development
- StarRating UI for simple and understandable rating system:
  - Instant visual feedback
  - Simple interaction (touch targets)
  - Clear state representation (filled/empty stars)
- Form validation rules matching API requirements:
  - climb.id: foreign key, required, passed from HomeScreen parent component as prop
  - funRating: required
  - comments: maxLength 500 characters
  - completed: boolean toggle switch, required
*/

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAddAttempt } from "../../utilities/customHooks/useAttempts";
import StarRating from "../../components/StarRating";

// Accepts navigation prop from AppContent parent component, climb prop from HomeScreen parent component
export default function AddAttemptScreen({ climb, onNavigateToHome }) {
  // Current user is obtained from AuthContext
  const { user } = useAuth();

  // Add attempt Tanstack Query mutation
  const { mutate: addAttempt, isPending } = useAddAttempt();

  // Simple state management for all form input data to attach to useAddAttempt Tanstack Query mutation
  const [funRating, setFunRating] = useState(0);
  const [comments, setComments] = useState("");
  const [completed, setCompleted] = useState(false);

  // Simple error state for form validation errors - remove when validation succeeds
  const [errors, setErrors] = useState({});

  // Handle cases where the climb isn't correctly passed via props - should not occur, but here as failsafe for network/unknown edge cases
  if (!climb) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No climb selected</Text>
        <TouchableOpacity onPress={onNavigateToHome} style={styles.backButton}>
          <Text>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Form data validation before being passed to mutation
  const validateForm = () => {
    // Create a blank error object for any validation errors
    const newErrors = {};

    // funRating: required
    if (!funRating) newErrors.rating = "Please rate your attempt";

    // comments: maxLength 500 characters
    if (comments.length > 500) newErrors.comments = "Comments cannot exceed 500 characters";

    // Attach any errors to the newErrors object
    setErrors(newErrors);

    // Only return when newErrors has 0 items
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = () => {
    // IF form is not valid, return early
    if (!validateForm()) return;

    // If user item is not attached, for edge-cases
    if (!user.id) {
      Alert.alert("Error", "Unable to authenticate user");
    }

    // Form data
    const attemptData = {
      climb_id: climb.id, // Passes directly from HomeScreen prop
      user_id: user.id, // user.id extracted from AuthContext
      fun_rating: funRating, // Fun rating handled by StarRating UI component will always be number, so no INT/Number forcing required
      completed: completed, // Boolean from toggle switch, defaults to false
      ...(comments.trim() && { comments: comments.trim() }), // Only attach a comment if there is one, otherwise send nothing not an empty string
    };

    // Tanstack Mutation function
    // - Data preparation with validation
    // - Mutation call with success/error handling
    // - Navigation on success, user feedback on error
    addAttempt(attemptData, {
      onSuccess: () => {
        Alert.alert("Success", "Attempt logged successfully!");
        onNavigateToHome();
      },
      onError: (error) => {
        console.error("Error adding attempt:", error);
        Alert.alert("Error", "Failed to log attempt. Please try again.");
      },
    });
  };

  return (
    // ScrollView container for the entire form if needed
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

      {/* Header with Back Button */}
      <View style={styles.header}>
        
        {/* Back Button */}
        <TouchableOpacity onPress={onNavigateToHome} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Log Attempt</Text>
        
        {/* Styling View for consistent display */}
        <View style={{ width: 60 }} /> 
      </View>

      {/* Climb Info Card */}
      <View style={styles.climbInfoCard}>
        <Text style={styles.climbStyle}>{climb.style_name}</Text>
        <Text style={styles.climbGrade}>Grade: {climb.difficulty_grade}</Text>
        <Text style={styles.climbGym}>{climb.gym_name}</Text>
        {/* Ensures set data value of climb appears in user friendly format */}
        {climb.set_date && (
          <Text style={styles.climbDate}>
            {/* Current scale of the application is only for Australian users */}
            Set: {new Date(climb.set_date).toLocaleDateString("en-AU")}
          </Text>
        )}
      </View>

      {/* Star Rating UI Component*/}
      <StarRating initialRating={funRating} onRatingChange={setFunRating} disabled={isPending} />
      {/* Conditionally render any rating errors */}
      {errors.rating && <Text style={styles.errorMessage}>{errors.rating}</Text>}

      {/* Completed Toggle */}
      <View style={styles.switchContainer}>
        <View>
          <Text style={styles.label}>Completed:</Text>
          <Text style={styles.subLabel}>
            {/* More user friendly text rather than boolean T/F */}
            {completed ? "You sent this climb!" : "Still working on it"}
          </Text>
        </View>
        {/* The switch itself - defaults to false */}
        <Switch
          value={completed}
          onValueChange={setCompleted}
          disabled={isPending}
          trackColor={{ false: "#d1d5db", true: "#10b981" }}
          thumbColor="#ffffff"
        />
      </View>

      {/* Comments - Optional but important, allows users to be reflective about their climbing */}
      <View style={[styles.formField, errors.comments && styles.inputError]}>
        <Text style={styles.label}>Comments (optional):</Text>
        
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={comments}
          onChangeText={setComments}
          placeholder={
            "How fun/challenging was it? Any beta? What worked? Any improvements since the last attempt?"
          }
          multiline
          numberOfLines={4}
          maxLength={500}
          editable={!isPending}
        />
        
        {/* Dynamically shows character length of entered comment */}
        <Text style={styles.charCount}>{comments.length} / 500 characters </Text>
        
        {/* Conditionally render any error messages */}
        {errors.comments && <Text style={styles.errorMessage}>{errors.comments}</Text>}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.submitButton, isPending && styles.submitButtonDisabled]}
        disabled={isPending} // Disabled while pending to avoid duplicate submissions
      >
        {/* Conditional text for submit button based on Pending state */}
        {isPending ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Log This Attempt</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

// AddAttemptScreen styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b7c4d2ff",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#ef4444",
    marginBottom: 20,
  },
  header: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#2563eb",
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
  },
  climbInfoCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  climbStyle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2563eb",
    marginBottom: 8,
  },
  climbGrade: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  climbGym: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  climbDate: {
    fontSize: 14,
    color: "#9ca3af",
    fontStyle: "italic",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  subLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  formField: {
    marginBottom: 24,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "white",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "right",
    marginTop: 4,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorMessage: {
    color: "#ef4444",
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#10b981",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#a7f3d0",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
