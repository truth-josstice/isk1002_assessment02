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

export default function AddClimbScreen({ onNavigateToHome }) {
  const { user } = useAuth();
  const { data: gyms = [], isLoading: gymsLoading } = useAllGyms();
  const { data: climbStyles = [], isLoading: stylesLoading } = useAllStyles();
  const { mutate: addClimb, isPending } = useAddClimb();

  const [selectedGymId, setSelectedGymId] = useState("");
  const [selectedStyleId, setSelectedStyleId] = useState("");
  const [difficultyGrade, setDifficultyGrade] = useState("");
  const [setDate, setSetDate] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!selectedGymId) newErrors.gym = "Please select a gym";
    if (!selectedStyleId) newErrors.style = "Please select a style";
    if (!difficultyGrade.trim()) newErrors.grade = "Please enter a difficulty grade";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const climbData = {
      gym_id: parseInt(selectedGymId),
      style_id: parseInt(selectedStyleId),
      difficulty_grade: difficultyGrade,
      user_id: user.id,
      set_date: setDate.trim() || getTodayDate(),
    };

    addClimb(climbData, {
      onSuccess: () => {
        Alert.alert("Success", "Climb added successfully!");
        onNavigateToHome();
      },
      onError: (error) => {
        console.error("Error adding climb:", error);
        Alert.alert("Error", "Failed to add climb. Please try again.");
      },
    });
  };

  const formatGymLabel = (gym) => {
    return `${gym.name} - ${gym.city}`;
  };

  if (gymsLoading || stylesLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Add New Climb</Text>

      {/* Gym Picker */}
      <View style={[styles.formField, errors.gym && styles.inputError]}>
        <Text style={styles.label}>Gym:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedGymId}
            onValueChange={setSelectedGymId}
            style={styles.picker}
          >
            <Picker.Item label="Select a gym..." value="" />
            {gyms.map((gym) => (
              <Picker.Item key={gym.id} label={formatGymLabel(gym)} value={gym.id.toString()} />
            ))}
          </Picker>
        </View>
        {errors.gym && <Text style={styles.errorMessage}>{errors.gym}</Text>}
      </View>

      {/* Style Picker */}
      <View style={[styles.formField, errors.style && styles.inputError]}>
        <Text style={styles.label}>Climbing Style:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedStyleId}
            onValueChange={setSelectedStyleId}
            style={styles.picker}
          >
            <Picker.Item label="Select a style..." value="" />
            {climbStyles.map((style) => (
              <Picker.Item
                key={style.id}
                label={`${style.name} - ${style.description}`}
                value={style.id.toString()}
              />
            ))}
          </Picker>
        </View>
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
          placeholder={`${getTodayDate()} (or manually enter YYYY-MM-DD)`}
        />
        <Text style={styles.infoText}>Leave blank if unknown</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={onNavigateToHome}
          style={[styles.button, styles.cancelButton]}
          disabled={isPending}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
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
