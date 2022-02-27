import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
} from "react-native";
import { Formik, useFormik } from "formik";
import _values from "lodash/values";
import {
  createRetentionFields,
  prepareSubmit,
  arrayToObject,
  BreathRoundsArray,
  BreathSessionValues,
  initialValues,
} from "./sessionEditHelpers";
import { useStore, StoredSession } from "../../store/useStore";
import { RootStackProps } from "../../types/navTypes";
import SessionEditAlerts from "./SessionEditAlerts";
import { sessionValidationSchema } from "./sessionValidationRules";
import { MyTextInput, NumberInput } from "./Inputs";
import { AnimatePresence, MotiView } from "moti";
import { styles } from "./styles";

const SessionEditFormik = ({ navigation, route }: RootStackProps<"SessionEdit">) => {
  const createNewSession = useStore((state) => state.createNewSession);
  const [showAlerts, setShowAlerts] = useState(false);

  return (
    <View style={{ flex: 1, paddingBottom: 125 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 10,
          paddingVertical: 10,
          borderBottomWidth: 1,
          backgroundColor: "#abc",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Create Session</Text>
      </View>
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
            <View>
              {/*----- Submit Button ------------*/}
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <TouchableOpacity
                  onPress={props.submitForm}
                  style={{
                    // flexDirection: "row",
                    // justifyContent: "center",
                    // width: 100,
                    padding: 5,
                    paddingHorizontal: 15,
                    borderWidth: 1,
                    backgroundColor: "#ccc",
                  }}
                >
                  <Text>Submit</Text>
                </TouchableOpacity>
              </View>
              {/*----- Form Fields ------------*/}
              <KeyboardAvoidingView
                style={{ flexDirection: "column", justifyContent: "center" }}
                behavior="padding"
                enabled
                keyboardVerticalOffset={120}
              >
                <ScrollView style={{}}>
                  <View style={styles.field}>
                    <Text style={styles.inputLabel}>Session Name</Text>
                    <MyTextInput
                      placeholder="Session Name"
                      onChangeText={props.handleChange("name")}
                      value={props.values.name}
                    />
                    <Text style={styles.errorText}>{props.errors.name}</Text>
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.inputLabel}>Breath Rounds</Text>
                    <NumberInput
                      placeholder="Breath Rounds"
                      onChangeText={props.handleChange("breathRounds")}
                      value={props.values.breathRounds}
                      includeDecimal={false}
                      maxLength={2}
                    />
                    <Text style={styles.errorText}>
                      {props.touched.breathRounds && props.errors.breathRounds}
                    </Text>
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.inputLabel}>Breath Reps Per Round</Text>
                    <NumberInput
                      placeholder="Breath Reps Per Round"
                      onChangeText={props.handleChange("breathReps")}
                      value={props.values.breathReps}
                      includeDecimal={false}
                      maxLength={3}
                    />
                    <Text style={styles.errorText}>{props.errors.breathReps}</Text>
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.inputLabel}>Recovery Breath Hold Time</Text>
                    <NumberInput
                      placeholder="Recovery Breath Hold Time (seconds)"
                      onChangeText={props.handleChange("recoveryHoldTime")}
                      value={props.values.recoveryHoldTime}
                      includeDecimal={false}
                      maxLength={3}
                    />
                    <Text style={styles.errorText}>{props.errors.recoveryHoldTime}</Text>
                  </View>

                  {props.values.retentionHoldTimes.map((el, index) => {
                    return (
                      <View style={styles.field} key={index}>
                        <Text style={styles.inputLabel}>Retention Hold Time {index + 1}</Text>
                        <NumberInput
                          key={index}
                          onChangeText={props.handleChange(
                            `retentionHoldTimes[${index}].holdTime`
                          )}
                          onBlur={props.handleBlur(`retentionHoldTimes[${index}].holdTime`)}
                          value={props.values.retentionHoldTimes[index].holdTime}
                          maxLength={3}
                        />
                        <Text style={styles.errorText}>
                          {props.errors?.retentionHoldTimes?.[index]?.holdTime}
                        </Text>
                      </View>
                    );
                  })}
                  <View style={[styles.field, { flexDirection: "row", alignItems: "center" }]}>
                    <Switch
                      style={{ transform: [{ scaleY: 0.8 }, { scaleX: 0.8 }] }}
                      onValueChange={(val) => props.setFieldValue("includeAlerts", val)}
                      value={props.values.includeAlerts}
                    />
                    <Text style={styles.inputLabel}>{`Session Alerts ${
                      props.values.includeAlerts ? "On" : "Off"
                    } `}</Text>
                  </View>
                  <AnimatePresence>
                    {props.values.includeAlerts && (
                      <MotiView
                        from={{
                          opacity: 0,
                          // scale: 0.9,
                        }}
                        animate={{
                          opacity: 1,
                          // scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          // scale: 0.9,
                        }}
                        style={{ marginBottom: 300 }}
                      >
                        <SessionEditAlerts
                          values={props.values}
                          errors={props.errors}
                          handleChange={props.handleChange}
                        />
                      </MotiView>
                    )}
                  </AnimatePresence>
                  <View style={{ paddingVertical: 100 }} />
                </ScrollView>
              </KeyboardAvoidingView>
            </View>
          );
        }}
      </Formik>
    </View>
  );
};

export default SessionEditFormik;
