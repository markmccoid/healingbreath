import * as React from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RootStackProps } from "../types/navTypes";
import { useStore } from "../store/useStore";
import useBreathNavigation from "../navigation/useBreathNavigation";

const SessionList = ({ navigation, route }: RootStackProps<"SessionList">) => {
  const sessions = useStore((state) => state.storedSessions);
  const activeSession = useStore((state) => state.activeSession);
  const { navigateToSession } = useBreathNavigation();

  React.useEffect(() => {
    console.log(
      "Sessions",
      sessions.map((el) => el.name)
    );
    console.log("Active Session", activeSession?.name);
  }, [activeSession]);
  return (
    <View style={{ flex: 1 }}>
      <Text>Session List</Text>

      {sessions.map((session) => {
        return (
          <View
            style={{
              borderWidth: 1,
              padding: 10,
              borderRadius: 10,
              marginBottom: 5,
              marginHorizontal: 15,
              backgroundColor: "#8D8ED6",
            }}
            key={session.id}
          >
            <TouchableOpacity
              onPress={() => {
                navigateToSession(session);
                // setActiveSession(session);
                // navigation.navigate("Session");
              }}
            >
              <Text>{`${session.id} - ${session.name}`}</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <View
        style={{
          position: "absolute",
          bottom: 30,
          right: 20,
          borderWidth: 1,
          borderRadius: 30,
          width: 60,
          height: 60,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>ADD</Text>
      </View>
      {/* <TouchableOpacity onPress={() => navigation.navigate("Session")}>
        <Text>Go To Session</Text>
      </TouchableOpacity> */}
      {/* <TouchableOpacity onPress={() => navigation.navigate("Main Modal")}>
        <Text>Show Modal</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default SessionList;
