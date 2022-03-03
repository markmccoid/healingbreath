import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { FormikTouched, FormikErrors, FormikHandlers } from "formik";
import { BreathSessionValues } from "./sessionEditHelpers";
import { loadAndPlaySound } from "../../hooks/useAlertSounds";
import { AlertSoundNames } from "../../utils/sounds/soundTypes";
import { NumberInput, NumberInputWError } from "./Inputs";
import { styles } from "./styles";
import ErrorInputWrapper from "./ErrorInputWrapper";

type Props = {
  values: BreathSessionValues;
  errors: FormikErrors<BreathSessionValues>;
  handleChange: FormikHandlers["handleChange"];
  touched: FormikTouched<BreathSessionValues>;
  handleBlur: FormikHandlers["handleBlur"];
};

function SessionEditAdvanced({ values, errors, touched, handleBlur, handleChange }: Props) {
  const onFieldUpdate = (fieldName: string, fn: () => AlertSoundNames) => {
    const newValue = fn();
    handleChange(fieldName)(newValue);
    loadAndPlaySound(newValue);
  };

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.field}>
          <Text>Inhale Time</Text>
          <NumberInputWError
            value={values.inhaleTime}
            includeDecimal
            onChangeText={handleChange("inhaleTime")}
            errorText={errors.inhaleTime}
            showErrorText
            onBlur={handleBlur("inhaleTime")}
            isTouched={touched.inhaleTime ?? false}
          />
        </View>
        <View style={styles.field}>
          <Text>Exhale Time</Text>
          <NumberInputWError
            value={values.exhaleTime}
            includeDecimal
            onChangeText={handleChange("exhaleTime")}
            errorText={errors.exhaleTime}
            showErrorText
            onBlur={handleBlur("exhaleTime")}
            isTouched={touched.exhaleTime ?? false}
          />
        </View>
      </View>

      <View style={{ flexDirection: "row" }}>
        <View style={styles.field}>
          <Text>Recovery Inhale </Text>

          <NumberInputWError
            value={values.actionPauseTimeIn}
            includeDecimal
            onChangeText={handleChange("actionPauseTimeIn")}
            errorText={errors.actionPauseTimeIn}
            showErrorText
            onBlur={handleBlur("actionPauseTimeIn")}
            isTouched={touched.actionPauseTimeIn ?? false}
          />
        </View>

        <View style={styles.field}>
          <Text>Recovery Exhale</Text>
          <NumberInputWError
            value={values.actionPauseTimeOut}
            includeDecimal
            onChangeText={handleChange("actionPauseTimeOut")}
            errorText={errors.actionPauseTimeOut}
            showErrorText
            onBlur={handleBlur("actionPauseTimeOut")}
            isTouched={touched.actionPauseTimeOut ?? false}
          />
        </View>
      </View>
    </View>
  );
}

export default SessionEditAdvanced;
