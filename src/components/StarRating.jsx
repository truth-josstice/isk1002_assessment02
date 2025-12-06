/*
Star Rating Component
Purpose: Interactive UI for rating how fun an attempt was on a scale of 1-5 stars.
- Mobile-optimised with large pixel touch targets (56x56)
- Visual feedback through scaling and opacity for selected stars
- Accessible with clearly selected/unselected icons
*/

import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function StarRating({ initialRating = 0, onRatingChange, disabled = false }) {
  // Set up a state for selected star rating (0-5)
  const [rating, setRating] = useState(initialRating);

  // Rating handler - handles local state (value 1-5) and passes to parent component
  const handleRating = (newRating) => {
    setRating(newRating);

    // IF rating changes before submission
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fun Rating:</Text>

      {/* Maps the values 1-5 to a tappable star icon UI feature */}
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            className={[
              styles.starButton,
              star <= rating && styles.filledStar, // Stars scale when selected
              disabled && styles.disabled,
            ]}
            onPress={() => !disabled && handleRating(star)}
            disabled={disabled}
            activeOpacity={0.7} // Slight visual feedback on press
          >
            <Text
              style={[
                styles.starIcon,
                star <= rating && styles.filledStarIcon, // Selected stars are completely opaque
              ]}
            >
              ⭐
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dynamic rating text showing current selection */}
      <Text style={styles.ratingText}>
        {rating > 0 ? `${rating} / 5 stars` : "Tap stars to rate"}
      </Text>
    </View>
  );
}

// Star rating component styling
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
    width: 56, // Minimum 44px for touch accessibility
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  filledStar: {
    backgroundColor: "#fef3c7",
    transform: [{ scale: 1.3 }], // Pop effect for selected stars
  },
  disabled: {
    opacity: 0.5, // Visual indicator when inactive
  },
  starIcon: {
    fontSize: 32,
    opacity: 0.3, // "Greyscale" effect for unselected stars
  },
  filledStarIcon: {
    opacity: 1, // Full opacity when selected
  },
  ratingText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
  },
});
