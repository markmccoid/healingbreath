import React, { useState } from "react";
import { TextInput } from "../common/TextInput";
import { Text, View, StyleSheet, Button, Alert, TouchableOpacity } from "react-native";
import { useForm, FormProvider, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import Constants from "expo-constants";

type FormValues = {
  email: string;
  password: string;
};

export default function App() {
  // useForm hook and set default behavior/values
  const { ...methods } = useForm({ mode: "onChange" });

  const onSubmit: SubmitHandler<FormValues> = (data) => console.log({ data });

  const [formError, setError] = useState<Boolean>(false);

  const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
    return console.log({ errors });
  };

  return (
    <View style={styles.container}>
      {formError ? (
        <View>
          <Text style={{ color: "red" }}>
            There was a problem with loading the form. Please try again later.
          </Text>
        </View>
      ) : (
        <>
          <FormProvider {...methods}>
            <TextInput
              name="name"
              label="Session Name"
              placeholder=""
              keyboardType="default"
              rules={{
                required: "Session Name is required!",
                maxLength: {
                  value: 15,
                  message: "Session can only be 15 chars long",
                },
              }}
              setFormError={setError}
            />
            <TextInput
              name="breathRounds"
              label="Number of Rounds"
              placeholder=""
              keyboardType="number-pad"
              rules={{
                min: {
                  value: 1,
                  message: "Must be greater than zero",
                },
              }}
              setFormError={setError}
            />
            <TextInput
              name="breathReps"
              label="Number of Breaths per Round"
              rules={{
                required: "Required!",
                min: {
                  value: 1,
                  message: "Must be greater than zero",
                },
              }}
              setFormError={setError}
            />
            <TextInput
              name="recoveryHoldTime"
              label="Recover Hold Time"
              rules={{
                required: "Required",
              }}
              setFormError={setError}
            />
          </FormProvider>
        </>
      )}
      <View style={styles.button}>
        <TouchableOpacity onPress={methods.handleSubmit(onSubmit, onError)}>
          <Text style={{ fontSize: 20 }}>Create</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    marginTop: 40,
    color: "white",
    height: 40,
    backgroundColor: "#ec5990",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
});
