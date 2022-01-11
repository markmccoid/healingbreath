import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import SessionList from "../screens/SessionList";
import Session from "../screens/Session/Session";

// Types
import { RootStackParamList } from "../types/navTypes";

const RootNav = () => {
  const RootStack = createStackNavigator<RootStackParamList>();
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="SessionList" component={SessionList} />
        <RootStack.Screen name="Session" component={Session} />
        <RootStack.Group
          screenOptions={{
            presentation: "modal",
            headerShown: false,
            cardStyle: { padding: 15 },
          }}
        >
          <RootStack.Screen name="Main Modal" component={Session} />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNav;
