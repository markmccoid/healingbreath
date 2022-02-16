import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";

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
  recoveryBreath: yup
    .number()
    .typeError("Field must be an intger greater than zero")
    .required()
    .integer("Field must be an integer")
    .positive("Field must be greater than zero"),
});
const SessionEditFormik = () => {
  return (
    <View style={{ flex: 1 }}>
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
        initialValues={{
          sessionName: "",
          breathRounds: "3",
          breathReps: "30",
          recoveryBreath: "15",
        }}
        validationSchema={sessionValidationSchema}
        onSubmit={(values) => console.log(values)}
      >
        {(props) => (
          <View>
            <View style={styles.field}>
              <Text style={styles.inputLabel}>Session Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Session Name"
                onChangeText={props.handleChange("sessionName")}
                value={props.values.sessionName}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.inputLabel}>Breath Rounds</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Breath Rounds"
                onChangeText={props.handleChange("breathRounds")}
                value={props.values.breathRounds}
                keyboardType="numeric"
                onBlur={props.handleBlur("breathRounds")}
              />
              <Text style={styles.errorMessage}>
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
            </View>
            <View style={styles.field}>
              <Text style={styles.inputLabel}>Recovery Breath Hold Time</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Recovery Breath Hold Time"
                onChangeText={props.handleChange("recoveryBreath")}
                value={props.values.recoveryBreath}
              />
            </View>
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
          </View>
        )}
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
  errorMessage: {
    fontWeight: "600",
    color: "crimson",
    textAlign: "center",
  },
  textInput: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 18,
  },
});

export default SessionEditFormik;
