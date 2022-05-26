import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { RootStackProps } from "../types/navTypes";
import { useStore } from "../store/useStore";
import useBreathNavigation from "../navigation/useBreathNavigation";
import SessionItem from "../components/SessionList/SessionItem";
import { AddIcon } from "../components/common/Icons";
import { useTheme } from "../context/themeContext";
import { Theme } from "../theme";

const SessionList = ({ navigation, route }: RootStackProps<"SessionList">) => {
  const sessions = useStore((state) => state.storedSessions);
  const deleteSession = useStore((state) => state.deleteSession);
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

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
      {/* SVG TEST BUTTON */}
      {/* <View style={{ position: "absolute", bottom: 50, left: 10 }}>
        <TouchableOpacity
          onPress={() => {
            console.log("nav to svg");
            navigation.navigate("svgtest");
          }}
        >
          <Text style={{ fontSize: 28 }}>SVG</Text>
        </TouchableOpacity>
      </View> */}
      <View style={styles.addButton}>
        <TouchableOpacity onPress={() => navigation.navigate("SessionEdit")}>
          <AddIcon size={30} color={theme?.colors.primaryFG} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    addButton: {
      position: "absolute",
      backgroundColor: theme.colors.primaryBG,
      bottom: 30,
      right: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 30,
      width: 60,
      height: 60,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 100,
    },
  });
  return styles;
};

export default SessionList;
