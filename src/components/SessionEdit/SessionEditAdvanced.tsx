import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { FormikErrors, FormikHandlers } from "formik";
import { BreathSessionValues } from "./sessionEditHelpers";
import { loadAndPlaySound } from "../../hooks/useAlertSounds";
import { AlertSoundNames } from "../../utils/sounds/soundTypes";
import { NumberInput } from "./Inputs";
import { styles } from "./styles";
import { MotiView } from "moti";
import { FiraSans_200ExtraLight_Italic } from "@expo-google-fonts/fira-sans";
import ErrorInputWrapper from "./ErrorInputWrapper";

type Props = {
  values: BreathSessionValues;
  errors: FormikErrors<BreathSessionValues>;
  handleChange: FormikHandlers["handleChange"];
};

function SessionEditAdvanced({ values, errors, handleChange }: Props) {
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
          <ErrorInputWrapper errorText={errors.inhaleTime} showErrorText>
            <NumberInput
              value={values.inhaleTime}
              includeDecimal
              onChangeText={handleChange("inhaleTime")}
            />
          </ErrorInputWrapper>
        </View>
        <View style={styles.field}>
          <Text>Exhale Time</Text>
          <ErrorInputWrapper errorText={errors.exhaleTime} showErrorText>
            <NumberInput
              value={values.exhaleTime}
              includeDecimal
              onChangeText={handleChange("exhaleTime")}
            />
          </ErrorInputWrapper>
        </View>
      </View>

      <View style={{ flexDirection: "row" }}>
        <View style={styles.field}>
          <Text>Recovery Inhale </Text>
          <ErrorInputWrapper errorText={errors.actionPauseTimeIn} showErrorText>
            <NumberInput
              value={values.actionPauseTimeIn}
              includeDecimal
              onChangeText={handleChange("actionPauseTimeIn")}
            />
          </ErrorInputWrapper>
        </View>

        <View style={styles.field}>
          <Text>Recovery Exhale</Text>
          <ErrorInputWrapper errorText={errors.actionPauseTimeOut} showErrorText>
            <NumberInput
              value={values.actionPauseTimeOut}
              includeDecimal
              onChangeText={handleChange("actionPauseTimeOut")}
            />
          </ErrorInputWrapper>
        </View>
      </View>
    </View>
  );
}

export default SessionEditAdvanced;
