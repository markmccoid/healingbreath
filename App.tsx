import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet, Text, View } from "react-native";
import RootNav from "./src/navigation/RootNav";

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <RootNav />
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
