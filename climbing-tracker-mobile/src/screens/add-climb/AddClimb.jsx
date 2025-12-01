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
}
