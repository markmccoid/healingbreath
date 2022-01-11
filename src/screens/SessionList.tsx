import * as React from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RootStackProps } from "../types/navTypes";

const SessionList = ({ navigation, route }: RootStackProps<"SessionList">) => {
  return (
    <View>
      <Text>Session List</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Session")}>
        <Text>Go To Session</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Main Modal")}>
        <Text>Show Modal</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SessionList;
