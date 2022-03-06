import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { RootStackProps } from "../types/navTypes";
import { useStore } from "../store/useStore";
import useBreathNavigation from "../navigation/useBreathNavigation";
import SessionItem from "../components/SessionList/SessionItem";
import { AddIcon } from "../components/common/Icons";

const SessionList = ({ navigation, route }: RootStackProps<"SessionList">) => {
  const sessions = useStore((state) => state.storedSessions);
  const deleteSession = useStore((state) => state.deleteSession);
  // const activeSession = useStore((state) => state.activeSession);
  // const { navigateToSession } = useBreathNavigation();
  // console.log(
  //   "sessions",
  //   sessions.map((el) => el)
  // );
  const navigateToEditSession = (sessionId: string) => {
    navigation.navigate("SessionEdit", { sessionId });
  };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ paddingTop: 10 }}>
        {sessions.map((session) => (
          <View key={session.id} style={{ marginBottom: 10 }}>
            <SessionItem
              session={session}
              deleteSession={deleteSession}
              handleEditSession={navigateToEditSession}
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.addButton}>
        <TouchableOpacity onPress={() => navigation.navigate("SessionEdit")}>
          <AddIcon size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    position: "absolute",
    backgroundColor: "#2D728F",
    bottom: 30,
    right: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
});
export default SessionList;
