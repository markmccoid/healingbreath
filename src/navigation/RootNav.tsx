import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import SessionList from "../screens/SessionList";
import Session from "../screens/Session/Session";

// Types
import { RootStackParamList } from "../types/navTypes";
import SessionEditMain from "../components/SessionEdit/SessionEditMain";

const RootNav = () => {
  const RootStack = createStackNavigator<RootStackParamList>();
  return (
    <NavigationContainer>
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
            component={SessionEditMain}
            options={{ headerShown: false }}
          />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNav;
