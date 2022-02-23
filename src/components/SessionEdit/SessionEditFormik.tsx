import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
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

const sessionValidationSchema = yup.object({
  sessionName: yup.string().required(),
  breathRounds: yup
    .number()
    .typeError("Field must be an intger greater than zero")
    .required()
    .integer("Field must be an integer")
    .positive("Field must be greater than zero"),
  breathReps: yup
    .number()
    .typeError("Field must be an intger greater than zero")
    .required()
    .integer("Field must be an integer")
    .positive("Field must be greater than zero"),
  recoveryHoldTime: yup
    .number()
    .typeError("Field must be an intger greater than zero")
    .required()
    .integer("Field must be an integer")
    .positive("Field must be greater than zero"),
  retentionHoldTimes: yup.array().of(
    yup.object().shape({
      holdTime: yup
        .number()
        .typeError("Must be a number")
        .required("Hold Time is required")
        .integer("Hold Time must be an integer")
        .positive("Hold Time must be positive"),
    })
  ),
  alerts: yup.object().shape({
    ConsciousForcedBreathing: yup.object().shape({
      alertEveryXBreaths: yup.object().shape({
        value: yup.number().typeError("Must Be a number").integer("Must be an integer"),
      }),
    }),
  }),
});
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
          // createNewSession(newSession);
          // navigation.goBack();
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
              <ScrollView style={{}}>
                <View style={styles.field}>
                  <Text style={styles.inputLabel}>Session Name</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Session Name"
                    onChangeText={props.handleChange("sessionName")}
                    value={props.values.sessionName}
                  />
                  <Text style={styles.errorText}>{props.errors.sessionName}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.inputLabel}>Breath Rounds</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Breath Rounds"
                    onChangeText={props.handleChange("breathRounds")}
                    value={props.values.breathRounds}
                    keyboardType="numeric"
                    maxLength={2}
                    onBlur={props.handleBlur("breathRounds")}
                  />
                  <Text style={styles.errorText}>
                    {props.touched.breathRounds && props.errors.breathRounds}
                  </Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.inputLabel}>Breath Reps Per Round</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Breath Reps Per Round"
                    onChangeText={props.handleChange("breathReps")}
                    value={props.values.breathReps}
                  />
                  <Text style={styles.errorText}>{props.errors.breathReps}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.inputLabel}>Recovery Breath Hold Time</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Recovery Breath Hold Time"
                    onChangeText={props.handleChange("recoveryHoldTime")}
                    value={props.values.recoveryHoldTime}
                  />
                  <Text style={styles.errorText}>{props.errors.recoveryHoldTime}</Text>
                </View>

                {props.values.retentionHoldTimes.map((el, index) => {
                  return (
                    <View style={styles.field} key={index}>
                      <Text>Retention Hold Time {index + 1}</Text>
                      <TextInput
                        style={styles.textInput}
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
                {props.values.includeAlerts && (
                  <View style={{ marginBottom: 300 }}>
                    <SessionEditAlerts
                      values={props.values}
                      errors={props.errors}
                      handleChange={props.handleChange}
                    />
                  </View>
                )}
                <View style={{ paddingVertical: 100 }} />
              </ScrollView>
            </View>
          );
        }}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 5,
    marginBottom: 2,
  },
  textInput: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 18,
  },
  errorText: {
    color: "crimson",
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "700",
  },
});

export default SessionEditFormik;
