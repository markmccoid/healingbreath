/// <reference types="nativewind/types" />

import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts, FiraSans_500Medium } from "@expo-google-fonts/fira-sans";
import { LogBox, StyleSheet, Text } from "react-native";
import useCachedResources from "./src/hooks/useCachedResources";
import RootNav from "./src/navigation/RootNav";
import DropDownPicker from "react-native-dropdown-picker";
import { ThemeProvider } from "./src/context/themeContext";

LogBox.ignoreLogs([
  "ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'.",
]);

export default function App() {
  const isLoadingComplete = useCachedResources();
  let [fontsLoaded] = useFonts({
    FiraSans_500Medium,
  });
  if (!fontsLoaded && !isLoadingComplete) {
    // return <AppLoading />;
    return null;
  }
  DropDownPicker.setListMode("SCROLLVIEW");

  // LogBox.ignoreLogs(["ViewPropTypes will be removed", "ColorPropType will be removed"]);

  return (
    <SafeAreaProvider>
      {/* <View style={styles.container}> */}
      <ThemeProvider>
        <RootNav />
      </ThemeProvider>
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
