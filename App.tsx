import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts, FiraSans_500Medium } from "@expo-google-fonts/fira-sans";
import { StyleSheet, Text, View } from "react-native";
import AppLoading from "expo-app-loading";
import RootNav from "./src/navigation/RootNav";
import DropDownPicker from "react-native-dropdown-picker";

export default function App() {
  let [fontsLoaded] = useFonts({
    FiraSans_500Medium,
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  DropDownPicker.setListMode("SCROLLVIEW");
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
