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
import { useAuth } from "../../context/AuthContext";
import { useAddAttempt } from "../../utilities/customHooks/useAttempts";
import StarRating from "../../components/StarRating";
import { useState } from "react";

export default function AddAttemptScreen({ climb, onNavigateToHome }) {
  const { user } = useAuth();
  const { mutate: addAttempt, isPending } = useAddAttempt();

  const [funRating, setFunRating] = useState(0);
  const [comments, setComments] = useState("");
  const [completed, setCompleted] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle cases where the climb isn't correctly passed via props
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

  const validateForm = () => {
    const newErrors = {};

    if (!funRating) newErrors.rating = "Please rate your attempt";
    if (comments.length > 500) newErrors.comments = "Comments cannot exceed 500 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (!user.id) {
      Alert.alert("Error", "Unable to authenticate user");
    }

    const attemptData = {
      climb_id: climb.id,
      user_id: user.id,
      fun_rating: funRating,
      completed: completed,
      ...(comments.trim() && { comments: comments.trim() }),
    };

    console.log("Sending attempt data:", attemptData);

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
    <ScrollView>
      <View>
        <TouchableOpacity>
          <Text></Text>
        </TouchableOpacity>
        <Text></Text>
        <View />
      </View>

      {/* Climb Info Card */}
      <View style={styles.climbInfoCard}>
        <Text style={styles.climbStyle}>{climb.style_name}</Text>
        <Text style={styles.climbGrade}>Grade: {climb.difficulty_grade}</Text>
        <Text style={styles.climbGym}>{climb.gym_name}</Text>
        {climb.set_date && (
          <Text style={styles.climbDate}>
            Set: {new Date(climb.set_date).toLocaleDateString("en-AU")}
          </Text>
        )}
      </View>

      {/* Star Rating */}
      <StarRating initialRating={funRating} onRatingChange={setFunRating} disabled={isPending} />
      {errors.rating && <Text style={styles.errorMessage}>{errors.rating}</Text>}

      {/* Completed Toggle */}
      <View style={styles.switchContainer}>
        <View>
          <Text style={styles.label}>Completed:</Text>
          <Text style={styles.subLabel}>
            {completed ? "You sent this climb!" : "Still working on it"}
          </Text>
        </View>
        <Switch
          value={completed}
          onValueChange={setCompleted}
          disabled={isPending}
          trackColor={{ false: "#d1d5db", true: "#10b981" }}
          thumbColor="#ffffff"
        />
      </View>

      {/* Comments */}
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
        <Text style={styles.charCount}>{comments.length} / 500 characters </Text>
        {errors.comments && <Text style={styles.errorMessage}>{errors.comments}</Text>}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.submitButton, isPending && styles.submitButtonDisabled]}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Log This Attempt</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
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
