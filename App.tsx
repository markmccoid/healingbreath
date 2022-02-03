import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts, FiraSans_500Medium } from "@expo-google-fonts/fira-sans";
import { StyleSheet, Text, View } from "react-native";
import AppLoading from "expo-app-loading";
import RootNav from "./src/navigation/RootNav";
import { alertSounds, loadSounds } from "./src/utils/sounds/soundLibrary";

export default function App() {
  let [soundsLoaded, setSoundsLoaded] = React.useState(false);
  let [fontsLoaded] = useFonts({
    FiraSans_500Medium,
  });
  if (!fontsLoaded || !soundsLoaded) {
    return (
      <AppLoading
        startAsync={loadSounds}
        onFinish={() => setSoundsLoaded(true)}
        onError={console.warn}
      />
    );
  }
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
