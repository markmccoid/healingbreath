import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { FormikErrors, FormikHandlers } from "formik";
import { BreathSessionValues } from "./sessionEditHelpers";
import { alertSoundNames } from "../../hooks/useAlertSounds";
import DropDownPicker from "react-native-dropdown-picker";

type Props = {
  values: BreathSessionValues;
  errors: FormikErrors<BreathSessionValues>;
  handleChange: FormikHandlers["handleChange"];
};

const pickerAlertSounds = alertSoundNames.map((sound) => ({
  label: sound,
  value: sound,
}));
function SessionEditAlerts({ values, errors, handleChange }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(pickerAlertSounds);

  const CFBAlerts = values.alerts?.ConsciousForcedBreathing;
  const CFBErrors = errors.alerts?.ConsciousForcedBreathing;

  React.useEffect(() => {
    if (value) {
      handleChange("alerts.ConsciousForcedBreathing.alertEveryXBreaths.sound")(value);
    }
  }, [value]);

  return (
    <View>
      <Text>ALERTS</Text>
      <View style={styles.field}>
        <Text style={styles.inputLabel}>Alert Every X</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Alert X"
          onChangeText={handleChange(
            "alerts.ConsciousForcedBreathing.alertEveryXBreaths.value"
          )}
          value={CFBAlerts?.alertEveryXBreaths?.value}
        />
        <Text style={styles.errorText}>{CFBErrors?.alertEveryXBreaths?.value}</Text>
      </View>
      <DropDownPicker
        open={open}
        value={CFBAlerts?.alertEveryXBreaths?.sound}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        // setItems={setItems}
      />
    </View>
  );
}

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
export default SessionEditAlerts;
