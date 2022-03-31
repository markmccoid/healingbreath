// Theme.context.tsx
import React from "react";
import { StyleSheet } from "react-native";
import { getTheme, Schemes, Theme } from "../theme";
// Our context provider will provide this object shape
type ProvidedThemeValues = {
  theme: Theme;
  changeTheme: (scheme: Schemes) => void;
};

// Creating our context
const Context = React.createContext<ProvidedThemeValues>({});
// Because our stateful context provider will be a React component
// we can define some props for it too
type Props = {
  children?: React.ReactNode;
};
// Creating our stateful context provider
// We are using React.memo for optimization
export const ThemeProvider = React.memo<Props>((props) => {
  // Store the actual theme as an internal state of the provider
  const [theme, setTheme] = React.useState<Theme>(getTheme());

  // Function that will change the theme
  const changeTheme = React.useCallback((scheme: Schemes) => {
    const theme = getTheme(scheme);
    setTheme(theme);
  }, []);

  // Building up the provided object
  // We're using the React.useMemo hook for optimization
  const themeValues = React.useMemo(() => {
    const value: ProvidedThemeValues = {
      theme,
      changeTheme,
    };
    return value;
  }, [theme, changeTheme]);

  // Render our context provider by passing it the value to provide
  return <Context.Provider value={themeValues}>{props.children}</Context.Provider>;
});
// Creating a custom context consumer hook for function components
export const useTheme = () => React.useContext(Context);

export const createStyles = (theme: Theme, styleObject: {}) => {
  const styles = StyleSheet.create({ ...styleObject });
  return styles;
};
// export const createStyles2 = (theme: Theme) => (styleObject: {}) => {
//   const styles = StyleSheet.create({ ...styleObject });
//   return styles;
// };

export const createStyles2 = (theme: Theme) => {
  return (obj) => {
    return StyleSheet.create(obj);
  };
};
