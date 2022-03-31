import { StyleSheet, Dimensions, ColorSchemeName, ViewStyle } from "react-native";

const dimensions = {
  fullHeight: Dimensions.get("window").height,
  fullWidth: Dimensions.get("window").width,
};
const baseColors = {
  white: "#ffffff",
};
const lightColors: Colors = {
  background: "#e7eaf0", //"#BB8DBB",
  border: "#777777",
  primaryBG: "#4a5568",
  primaryFG: "#ffffff",
  cardBG: "#7e91b2",
  cardFG: "#000000",
  cardTitleBG: "#4a5568",
  cardTitleFG: "#ffffff",
  displayBG: "#b9c2db",
  displayFG: "#000000",
  displayBorder: "#4a5568",
  iconBG: "#ffffff",
  iconFG: "#000000",
  iconBorder: "#000000",
  inputBG: "#ffffff",
  inputFG: "#000000",
  inputBorder: "#999",
  buttonBG: "#ffffff",
  buttonFG: "#000000",
  buttonBorder: "#000000",
  menuActiveBG: "#ffffff",
  menuActiveFG: "#000000",
  menuInactiveBG: "#4a5568",
  menuInactiveFG: "#ffffff",
  card: "#e7eaf0", // React Navigation Header color
  notification: "rgb(255, 59, 48)", // React Navigation
  text: "#000000", // React Navigation
};

const darkColors: Colors = {
  background: "#382335",
  border: "#000000",
  primaryBG: "#000000",
  primaryFG: "#ffffff",
  cardBG: "#ffffffaa",
  cardFG: "#000000",
  cardTitleBG: "#4a5568",
  cardTitleFG: "#ffffff",
  displayBG: "#b9c2db",
  displayFG: "#000000",
  displayBorder: "#4a5568",
  iconBG: "#000000",
  iconFG: "#ffffff",
  iconBorder: "#999",
  inputBG: "#000000aa",
  inputFG: "#ffffff",
  inputBorder: "#999",
  buttonBG: "#ffffff",
  buttonFG: "#000000",
  buttonBorder: "#000000",
  menuActiveBG: "#ffffff",
  menuActiveFG: "#000000",
  menuInactiveBG: "#4a5568",
  menuInactiveFG: "#ffffff",
  card: "#382335", // React Navigation Header color
  notification: "rgb(255, 59, 48)", // React Navigation
  text: "#ffffff", // React Navigation
};

const padding = {
  sm: 10,
  md: 20,
  lg: 30,
  xl: 40,
};

const fonts = {
  sm: 12,
  md: 18,
  lg: 28,
  primary: "Cochin",
};

// export type Schemes = "light" | "dark" | undefined;
export type Schemes = ColorSchemeName;
export type Colors = {
  background: string;
  border: string;
  primaryBG: string;
  primaryFG: string;
  cardBG: string;
  cardFG: string;
  cardTitleBG: string;
  cardTitleFG: string;
  displayBG: string;
  displayFG: string;
  displayBorder: string;
  iconBG: string;
  iconFG: string;
  iconBorder: string;
  inputBG: string;
  inputFG: string;
  inputBorder: string;
  buttonBG: string;
  buttonFG: string;
  buttonBorder: string;
  menuActiveBG: string;
  menuActiveFG: string;
  menuInactiveBG: string;
  menuInactiveFG: string;
  card: string; // React Navigation Header color
  notification: string; // React Navigation
  text: string; // React Navigation
};
export type Theme = {
  colors: Colors;
  padding: {};
  fonts: {};
};
export const getTheme = (scheme: Schemes = "light"): Theme => {
  return {
    colors: scheme === "light" ? lightColors : darkColors,
    padding,
    fonts,
  };
};

export const colors = {
  darkest: "#4a5568",
  dark: "#7e91b2",
  gray: "#b9c2db",
  white: "#fff",
  borderColor: "#777",
  alertColor: "crimson",
};

export const styleHelpers = {
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};
