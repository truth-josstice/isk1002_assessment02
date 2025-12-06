/* 
HomeScreen
Purpose: Entry screen for authenticated users, showing currently uploaded climbs and user's existing attempts
with buttons for Log Out, AddClimb, and clickable cards for AddAttempts
Navigates to: 
- LoginScreen (via LogOut Button)
- AddClimbScreen
- AddAttemptScreen

Features:
- Accepts navigation props from parent component for state based navigation
- Conditional rendered cards in single function to keep codebase DRY
- Passes climb data to child props through TouchableOpacity cards
- Scrollable content for best UX
- Simple logout button to remove token from SecureStore
*/

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useAllClimbs } from "../../utilities/customHooks/useClimbs";
import { useAllAttempts } from "../../utilities/customHooks/useAttempts";

// Accepts navigation props from AppContent parent component
export default function HomeScreen({ onNavigateToAddClimb, onNavigateToAddAttempt }) {
  // Current user taken from AuthContext, logout removes token from SecureStore
  const { user, logout } = useAuth();

  // Climb data is an array of objects, blank array as failsafe
  const { data: climbs = [], isLoading: climbsLoading } = useAllClimbs();

  // User attempts data is object of objects, blank object as failsafe
  const { data: attemptsData = {}, isLoading: attemptsLoading } = useAllAttempts();

  // Convert attempts data from received object into an array of objects, with blank array as failsafe
  const attempts = attemptsData.attempts || [];

  /**
   * Renders a card for either a climb or an attempt
   * @param {Object} item - The climb or attempt data
   * @param {boolean} isAttempt - Whether this is an attempt card
   * @returns {JSX.Element} Card component
   */
  const renderCard = (item, isAttempt = false) => (
    // Tappable Card Wrapper
    <TouchableOpacity
      style={styles.card}
      key={item.id} // Extracts and attaches each item's id to the mapped card
      // IF the card is not an attempt, attach the item prop to the child component
      onPress={() => {
        if (!isAttempt) {
          onNavigateToAddAttempt(item);
        }
      }}
    >
      {/* Conditionally fill the card details */}
      {isAttempt ? (
        // If the item in the map is an attempt:
        <>
          <Text style={styles.attemptDetails}>
            {item.climb.style_name} - {item.climb.gym_name}
          </Text>
          <Text style={styles.funRating}>
            Fun: {"⭐".repeat(item.fun_rating)} ({item.fun_rating}/5)
          </Text>
          <Text style={styles.completed}>
            {item.completed ? "✓ Sent it!" : "✗ Still projecting it!"}
          </Text>
          {item.comments && <Text style={styles.comments}>"{item.comments}"</Text>}
          <Text style={styles.date}>
            {/* Display AU format time (current application scales only to local Australian users) */}
            Attempted at: {new Date(item.attempted_at).toLocaleDateString("en-AU")}
          </Text>
        </>
      ) : (
        // If the item in the map is NOT an attempt:
        <>
          <Text style={styles.routeStyle}>{item.style_name}</Text>
          <Text style={styles.grade}>Grade: {item.difficulty_grade}</Text>
          <Text style={styles.gym}>Gym: {item.gym_name}</Text>
          <Text style={styles.setDate}>
            Set: {new Date(item.set_date).toLocaleDateString("en-AU")}
          </Text>
          <Text style={styles.addedBy}>Climb added by: {item.username}</Text>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcome}>Welcome back, {user?.username || "User"}!</Text>
        </View>

        {/* Climbs Section */}
        <Text style={styles.sectionTitle}>Current Climbs Added by Users</Text>
        <Text style={styles.infoText}>Tap a climb to add an attempt!</Text>

        {/* Conditionally render climbs for blank climbs list, existing climbs list, loading state */}
        {climbsLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Loading climbs...</Text>
          </View>
        ) : climbs.length === 0 ? (
          <Text style={styles.emptyText}>No climbs yet, add a climb to get started!</Text>
        ) : (
          // Map powered by the renderCard function
          <View style={styles.list}>{climbs.map((climb) => renderCard(climb, false))}</View>
        )}

        {/* Attempts Section */}
        <Text style={styles.attemptsSectionTitle}>My Recent Attempts</Text>

        {/* Conditionally render attempts for blank attempts list, existing attempts list, loading state */}
        {attemptsLoading ? (
          <ActivityIndicator size="small" color="#2563eb" />
        ) : attempts.length === 0 ? (
          <Text style={styles.emptyText}>No attempts logged yet - wanna go climbing?</Text>
        ) : (
          // Map powered by the renderCard function
          <View style={styles.attemptsList}>
            {attempts.map((attempt) => renderCard(attempt, true))}
          </View>
        )}
      </ScrollView>

      {/* Floating Buttons */}
      {/* Logout button - sets user in AuthContext to null (AuthContext handles navigation) */}
      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Add Climb button - navigates to AddClimbScreen */}
      <TouchableOpacity onPress={onNavigateToAddClimb} style={styles.addClimbButton}>
        <Text style={styles.addButtonIcon}>Add Climb</Text>
      </TouchableOpacity>
    </View>
  );
}

// HomeScreen content styling
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#b7c4d2ff",
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 32,
    paddingTop: 50,
    paddingBottom: 16,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  infoText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    color: "#0f172a",
    paddingHorizontal: 32,
    marginBottom: 14,
  },
  attemptsSectionTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    paddingHorizontal: 32,
    marginBottom: 16,
    marginTop: 24,
  },
  list: {
    paddingHorizontal: 32,
  },
  attemptsList: {
    paddingHorizontal: 32,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeStyle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2563eb",
  },
  attemptDetails: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },
  grade: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
  gym: {
    fontSize: 16,
    color: "#475569",
    marginTop: 4,
  },
  setDate: {
    fontSize: 15,
    color: "#64748b",
    marginTop: 4,
  },
  addedBy: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 8,
    fontStyle: "italic",
  },
  funRating: {
    fontSize: 16,
    marginTop: 8,
    color: "#f59e0b",
  },
  completed: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: "600",
    color: "#10b981",
  },
  comments: {
    fontSize: 15,
    marginTop: 8,
    color: "#475569",
    fontStyle: "italic",
  },
  date: {
    fontSize: 14,
    marginTop: 12,
    color: "#94a3b8",
  },
  center: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
  },
  emptyText: {
    fontSize: 18,
    color: "#64748b",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  logoutButton: {
    position: "absolute",
    left: 32,
    bottom: 32,
    backgroundColor: "#ef4444",
    width: 70,
    height: 70,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  addClimbButton: {
    position: "absolute",
    right: 32,
    bottom: 32,
    backgroundColor: "#2563eb",
    width: 70,
    height: 70,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addAttemptButton: {
    position: "absolute",
    right: 164,
    bottom: 32,
    backgroundColor: "#0a8110ff",
    width: 70,
    height: 70,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonIcon: {
    textAlign: "center",
    color: "white",
    fontSize: 17,
    fontWeight: "500",
  },
});
