import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/utilities/constants/queryClient";

import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

import styles from "./index.scss"

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <View className={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
    </QueryClientProvider>
  );
}


