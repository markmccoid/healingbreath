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
  Pressable,
} from "react-native";
import { Formik, FormikProps, useFormik } from "formik";
import _values from "lodash/values";
import { BreathSessionValues } from "./sessionEditHelpers";
import { useStore, StoredSession } from "../../store/useStore";
import { RootStackProps } from "../../types/navTypes";
import SessionEditAlerts from "./SessionEditAlerts";
import { sessionValidationSchema } from "./sessionValidationRules";
import { TextInputWError, NumberInput, NumberInputWError } from "./Inputs";
import { AnimatePresence, MotiView } from "moti";
import { styles } from "./styles";
import SessionEditAdvanced from "./SessionEditAdvanced";
import ErrorInputWrapper from "./ErrorInputWrapper";

const SessionEditMainSettings = ({
  navigation,
  route,
  ...props
}: RootStackProps<"SessionEdit"> & FormikProps<BreathSessionValues>) => {
  const createUpdateSession = useStore((state) => state.createUpdateSession);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  return (
    <View
      style={{
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      {/*----- Submit Button ------------*/}
      {/* <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
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
      </View> */}
      {/*----- Form Fields ------------*/}
      <KeyboardAvoidingView
        style={{
          flexGrow: 1,
        }}
        behavior="padding"
        enabled
        keyboardVerticalOffset={150}
      >
        <ScrollView
          style={{ flex: 1, marginBottom: 15, paddingTop: 50 }}
          contentContainerStyle={{ paddingBottom: 150 }}
          // contentContainerStyle={{ flexGrow: 1, borderWidth: 1, justifyContent: "flex-start" }}
        >
          <View
            style={[
              styles.rowContainer,
              { flexDirection: undefined, justifyContent: undefined },
            ]}
          >
            <View style={styles.field}>
              <Text style={styles.inputLabel}>Session Name</Text>
              <TextInputWError
                style={{ width: "100%" }}
                placeholder="Session Name"
                onChangeText={props.handleChange("name")}
                value={props.values.name}
                onBlur={props.handleBlur("name")}
                errorText={props.errors.name}
                showErrorText
                isTouched={props.touched.name ?? false}
              />
            </View>
          </View>
          <View style={[styles.rowContainer, { justifyContent: "space-between" }]}>
            <View style={styles.field}>
              <Text style={styles.inputLabel}>Breath Rounds</Text>
              <NumberInputWError
                // placeholder="Breath Rounds"
                onChangeText={props.handleChange("breathRounds")}
                value={props.values.breathRounds}
                includeDecimal={false}
                maxLength={2}
                onBlur={props.handleBlur("breathRounds")}
                errorText={props.errors.breathRounds}
                showErrorText
                isTouched={props.touched.breathRounds ?? false}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.inputLabel}>Breath Reps Per Round</Text>
              <NumberInputWError
                // placeholder="Breath Reps Per Round"
                onChangeText={props.handleChange("breathReps")}
                value={props.values.breathReps}
                includeDecimal={false}
                maxLength={3}
                onBlur={props.handleBlur("breathReps")}
                errorText={props.errors.breathReps}
                showErrorText
                isTouched={props.touched.breathReps ?? false}
              />
            </View>
          </View>
          <View style={[styles.rowContainer, { justifyContent: "flex-start" }]}>
            <View style={[styles.field]}>
              <Text style={styles.inputLabel}>Recovery Breath Hold Time</Text>
              <NumberInputWError
                // placeholder="Recovery Breath Hold Time (seconds)"
                onChangeText={props.handleChange("recoveryHoldTime")}
                value={props.values.recoveryHoldTime}
                includeDecimal={false}
                maxLength={3}
                onBlur={props.handleBlur("recoveryHoldTime")}
                errorText={props.errors.recoveryHoldTime}
                showErrorText
                isTouched={props.touched.recoveryHoldTime ?? false}
              />
            </View>
          </View>

          <View
            style={[
              styles.rowContainer,
              {
                marginVertical: 10,
                marginHorizontal: 10,
                flexDirection: "column",
                alignItems: "flex-start",
              },
            ]}
          >
            <Text style={styles.inputLabel}>Retention Hold Times</Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                alignSelf: "center",
              }}
            >
              {props.values.retentionHoldTimes.map((el, index) => {
                return (
                  <View style={{ margin: 5, width: 70 }} key={index}>
                    {/* <Text style={styles.inputLabel}>Retention Hold Time {index + 1}</Text> */}
                    <Text style={{ textAlign: "center" }}>{index + 1}</Text>
                    <NumberInputWError
                      style={{ textAlign: "center" }}
                      key={index}
                      onChangeText={props.handleChange(
                        `retentionHoldTimes[${index}].holdTime`
                      )}
                      onBlur={props.handleBlur(`retentionHoldTimes[${index}].holdTime`)}
                      value={props.values.retentionHoldTimes[index].holdTime}
                      maxLength={3}
                      errorText={props.errors?.retentionHoldTimes?.[index]?.holdTime}
                      showErrorText
                      isTouched={props.touched?.retentionHoldTimes?.[index]?.holdTime ?? false}
                    />
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SessionEditMainSettings;
