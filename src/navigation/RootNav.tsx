import * as React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import SessionList from "../screens/SessionList";
import Session from "../screens/Session/Session";
import SessionStats from "../screens/SessionStats";

// Types
import { RootStackParamList } from "../types/navTypes";
// import SessionEditMain from "../components/SessionEdit/SessionEditMain";
// import SessionEdit from "../components/SessionEdit/SessionEditFormik";
import SessionEdit from "../components/SessionEdit/SessionEdit";
import { useColorScheme } from "react-native";
import { useTheme } from "../context/themeContext";
import SVGTest from "../components/SVGTest";
import SessionFinishedStats from "../screens/Session/SessionFinishedStats";

const RootNav = () => {
  const scheme = useColorScheme();
  const { theme, changeTheme } = useTheme();

  React.useEffect(() => {
    changeTheme(scheme);
  }, [scheme]);

  const RootStack = createStackNavigator<RootStackParamList>();
  return (
    <NavigationContainer theme={{ colors: theme.colors, dark: scheme === "dark" }}>
      {/* <NavigationContainer theme={scheme === "dark" ? MyDarkTheme : MyTheme}> */}
      <RootStack.Navigator>
        <RootStack.Screen
          name="SessionList"
          component={SessionList}
          options={{ headerTitle: "Session List" }}
        />
        <RootStack.Screen
          options={{
            headerShown: false,
          }}
          name="Session"
          component={Session}
        />
        <RootStack.Group
          screenOptions={{
            presentation: "modal",
            headerShown: false,
          }}
        >
          <RootStack.Screen name="Main Modal" component={Session} />
          <RootStack.Screen
            name="SessionEdit"
            component={SessionEdit}
            options={{ headerShown: false }}
          />
          {/* <RootStack.Screen name="svgtest" component={SVGTest} /> */}
          <RootStack.Screen name="SessionStats" component={SessionStats} />

          <RootStack.Screen name="SessionFinished" component={SessionFinishedStats} />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNav;
