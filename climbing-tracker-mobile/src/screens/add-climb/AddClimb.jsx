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

export default function AddClimbScreen({ onNavigateToHome }) {
  const { data: gyms = [], isLoading: gymsLoading } = useAllGyms();
  const { data: styles = [], isLoading: stylesLoading } = useAllStyles();
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
      ...(setDate.trim() && { set_date: setDate }),
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
            {styles.map((style) => (
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
        
      </View>

    </ScrollView>
  );
}
