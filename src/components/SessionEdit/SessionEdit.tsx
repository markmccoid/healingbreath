import React from "react";
import { MotiView, Text } from "@motify/components";
import { View, StyleSheet, TouchableOpacity } from "react-native";
// import SegmentedControl from "rn-segmented-control";
import SegmentedControl from "../../components/SegmentedControl";
import { AnimatePresence } from "@motify/core";
import { Formik, useFormik } from "formik";
import SessionEditMainSettings from "./SessionEditMainSettings";
import { RootStackProps } from "../../types/navTypes";
import { useStore } from "../../store/useStore";
import { sessionValidationSchema } from "./sessionValidationRules";
import { createRetentionFields, prepareSubmit, initialValues } from "./sessionEditHelpers";
import SessionEditAlerts from "./SessionEditAlerts";
import SessionEditAdvanced from "./SessionEditAdvanced";
import { SaveIcon } from "../common/Icons";
import { convertKeyValsToString } from "../../utils/helpers";
import _ from "lodash";
import { colors, Theme } from "../../theme";
import { useTheme } from "../../context/themeContext";
import ModalHeader from "../ModalHeader";

const MotiBox = () => {
  return (
    <MotiView
      from={{
        opacity: 0,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
      }}
      style={{ backgroundColor: "yellow" }}
    />
  );
};

const SessionEdit = ({ navigation, route }: RootStackProps<"SessionEdit">) => {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [sessionSettings, setSessionSettings] = React.useState(initialValues);
  const createUpdateSession = useStore((state) => state.createUpdateSession);
  const getSessionFromId = useStore((state) => state.getSessionFromId);
  const sessionId = route?.params?.sessionId;
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  //console.log("sessionID", sessionId);
  React.useEffect(() => {
    // If sessionId is not undefined, we are editing a session
    if (sessionId) {
      // Since editing, all times will be numbers, must convert to strings
      const session = convertKeyValsToString(getSessionFromId(sessionId), [], true);
      // Must convert the breathRoundsDetail key to retentionHoldTimes and make an array of objects
      // version an object with keys 1,2,3...
      // also "rename" the alertSettings to alerts.  Yeah, I should have just named them the same, get over it!
      const updatedSession = {
        ...session,
        retentionHoldTimes: _.map(session.breathRoundsDetail),
        alerts: session.alertSettings,
      };
      // update teh sessionSettings state value, causing a rerender, which will
      // cause Formik to use the fields from session we are editing.
      setSessionSettings(updatedSession);
    }
  }, [sessionId]);
  return (
    <View style={styles.container}>
      <ModalHeader headerText={`${sessionId ? "Edit" : "Create"} Session`} />

      <View style={styles.menubox}>
        <SegmentedControl
          containerMargin={16}
          segments={["Settings", "Alerts", "Advanced"]}
          onChange={(index) => setTabIndex(index)}
          currentIndex={tabIndex}
          segmentedControlWrapper={{ backgroundColor: theme.colors.menuInactiveBG }}
          tileStyle={{ backgroundColor: theme.colors.menuActiveBG }}
          activeTextStyle={{ color: theme.colors.menuActiveFG }}
          inactiveTextStyle={{ color: theme.colors.menuInactiveFG }}
        />
      </View>
      <View style={{ flexGrow: 1 }}>
        <Formik
          initialValues={sessionSettings}
          enableReinitialize
          validationSchema={sessionValidationSchema}
          onSubmit={(values) => {
            console.log("session ID", sessionId);
            const newSession = prepareSubmit(values, sessionId);
            // console.log("values", newSession);
            createUpdateSession(newSession);
            navigation.goBack();
          }}
        >
          {(props) => {
            //* =-=
            //* Create retentionBreath array entries IF the length of the current retentionHoldTimes
            //* array is NOT equal to the num of breathRounds AND breathRounds isn't empty
            //* if we don't check for empty when blank all values are wiped out
            if (
              parseInt(props.values.breathRounds) !== props.values.retentionHoldTimes.length &&
              props.values.breathRounds
            ) {
              props.values.retentionHoldTimes = createRetentionFields(
                props.values.breathRounds,
                props.values.defaultHoldTime,
                props.values.retentionHoldTimes
              );
            }

            return (
              <View style={{ flexGrow: 1 }}>
                <View style={styles.buttonPosition}>
                  <TouchableOpacity
                    disabled={props.isSubmitting}
                    onPress={props.submitForm}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                    <SaveIcon size={20} style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
                <AnimatePresence exitBeforeEnter>
                  {tabIndex === 0 && (
                    <MotiView
                      from={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={0}
                      style={{ flexGrow: 1 }}
                    >
                      <SessionEditMainSettings
                        navigation={navigation}
                        route={route}
                        {...props}
                      />
                    </MotiView>
                  )}
                  {tabIndex === 1 && (
                    <MotiView
                      style={{ flexGrow: 1 }}
                      from={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={1}
                    >
                      <SessionEditAlerts
                        values={props.values}
                        errors={props.errors}
                        touched={props.touched}
                        handleChange={props.handleChange}
                        handleBlur={props.handleBlur}
                      />
                    </MotiView>
                  )}
                  {tabIndex === 2 && (
                    <MotiView
                      from={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={2}
                    >
                      <SessionEditAdvanced
                        values={props.values}
                        errors={props.errors}
                        touched={props.touched}
                        handleBlur={props.handleBlur}
                        handleChange={props.handleChange}
                      />
                    </MotiView>
                  )}
                </AnimatePresence>
              </View>
            );
          }}
        </Formik>
      </View>
      <View>
        <Text>1</Text>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      // justifyContent: "center",
    },
    menubox: {
      // flex: 1,
      alignItems: "center",
      marginHorizontal: 16,
      marginTop: 15,
      // marginVertical: 16,
    },
    button: {
      marginTop: 10,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.buttonBorder,
      backgroundColor: theme.colors.buttonBG,
      borderRadius: 10,
      flexDirection: "row",
    },
    buttonText: {
      fontSize: 18,
      color: theme.colors.buttonFG,
    },
    buttonPosition: {
      flexDirection: "row",
      justifyContent: "space-around",
      position: "absolute",
      top: 0,
      right: 50,
      zIndex: 1000,
    },
  });
  return styles;
};

export default SessionEdit;
