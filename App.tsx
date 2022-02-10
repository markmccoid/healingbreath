import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts, FiraSans_500Medium } from "@expo-google-fonts/fira-sans";
import { StyleSheet, Text, View } from "react-native";
import AppLoading from "expo-app-loading";
import RootNav from "./src/navigation/RootNav";
import { useLoadSounds } from "./src/utils/sounds/soundLibrary";

export default function App() {
  let [soundsLoaded] = useLoadSounds();
  let [fontsLoaded] = useFonts({
    FiraSans_500Medium,
  });
  console.log(soundsLoaded, fontsLoaded);
  if (!fontsLoaded || !soundsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaProvider>
      {/* <View style={styles.container}> */}
      <RootNav />
      <StatusBar style="auto" />
      {/* </View> */}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
