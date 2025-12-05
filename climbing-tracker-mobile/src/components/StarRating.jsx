import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function StarRating({ initialRating = 0, onRatingChange, disabled = false }) {
  // Set up a state for rating using UI
  const [rating, setRating] = useState(initialRating);

  // rating handler
  const handleRating = (newRating) => {
    setRating(newRating);

    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fun Rating:</Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            className={[
              styles.starButton,
              star <= rating && styles.filledStar,
              disabled && styles.disabled,
            ]}
            onPress={() => !disabled && handleRating(star)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Text style={styles.starIcon}>⭐</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.ratingText}>
        {rating > 0 ? `${rating} / 5 stars` : "Tap stars to rate"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  starButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  filledStar: {
    backgroundColor: "#fef3c7",
    transform: [{ scale: 1.1 }],
  },
  disabled: {
    opacity: 0.5,
  },
  starIcon: {
    fontSize: 32,
  },
  ratingText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
  },
});