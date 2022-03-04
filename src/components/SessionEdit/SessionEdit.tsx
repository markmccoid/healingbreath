import React from "react";
import { MotiView, Text } from "@motify/components";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import SegmentedControl from "rn-segmented-control";
import { AnimatePresence } from "@motify/core";
import { Formik, useFormik } from "formik";
import SessionEditMainSettings from "./SessionEditMainSettings";
import { RootStackProps } from "../../types/navTypes";
import { useStore } from "../../store/useStore";
import { sessionValidationSchema } from "./sessionValidationRules";
import { createRetentionFields, prepareSubmit, initialValues } from "./sessionEditHelpers";
import SessionEditAlerts from "./SessionEditAlerts";
import SessionEditAdvanced from "./SessionEditAdvanced";

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
  const createNewSession = useStore((state) => state.createNewSession);

  return (
    <View style={styles.container}>
      <View style={styles.menubox}>
        <View
          style={{
            borderTopRightRadius: 5,
            borderTopLeftRadius: 5,
            backgroundColor: "#4a5568",
            paddingVertical: 4,
            paddingHorizontal: 35,
          }}
        >
          <Text style={{ fontSize: 20, color: "white", fontWeight: "600" }}>
            Create Session
          </Text>
        </View>
        <SegmentedControl
          containerMargin={16}
          segments={["Settings", "Alerts", "Advanced"]}
          onChange={(index) => setTabIndex(index)}
          currentIndex={tabIndex}
          segmentedControlWrapper={{ backgroundColor: "#4a5568" }}
          activeTextStyle={styles.customBlackColor}
          inactiveTextStyle={styles.customWhiteColor}
        />
      </View>
      <View style={{ flexGrow: 1 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={sessionValidationSchema}
          onSubmit={(values) => {
            const newSession = prepareSubmit(values);
            createNewSession(newSession);
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
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    position: "absolute",
                    top: 0,
                    right: 50,
                    zIndex: 1000,
                  }}
                >
                  <TouchableOpacity
                    disabled={props.isSubmitting}
                    onPress={props.submitForm}
                    style={{
                      marginTop: 10,
                      paddingVertical: 8,
                      paddingHorizontal: 15,
                      borderWidth: StyleSheet.hairlineWidth,
                      backgroundColor: "#fff",
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>Save</Text>
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

  customBlackColor: {
    color: "black",
  },
  customWhiteColor: {
    color: "white",
  },
  customGreenColor: {
    color: "#3f6212",
  },
  customBlueColor: {
    backgroundColor: "#e0f2fe",
  },
  customBlueTextColor: {
    color: "#0369a1",
  },
  customBadgeBlueColor: {
    backgroundColor: "#38bdf8",
  },
});

export default SessionEdit;