import { FormikErrors } from "formik";
import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { getObjValueFromString } from "../../utils/helpers";
import { AlertSoundNames } from "../../utils/sounds/soundTypes";
import { BreathSessionValues } from "./sessionEditHelpers";

type Props = {
  values: BreathSessionValues;
  errors: FormikErrors<BreathSessionValues>;
  field: string;
  onFieldUpdate: {
    pickerFieldUpdate: (fieldName: string, fn: () => AlertSoundNames) => void;
    handleChange: (field: string) => void;
  };
  title: string;
  pickerStateInfo: {
    pickerStates: { [key: string]: boolean };
    updatePickerStates: (pickerKey: string, isOpen: boolean) => void;
    pickerKey: string;
  };
  pickerItems: {
    label: string;
    value: string;
  }[];
};

function AlertInput({
  values,
  errors,
  field,
  onFieldUpdate,
  title,
  pickerStateInfo,
  pickerItems,
}: Props) {
  // Get the value from the formik values object.
  // in essense constructs values.alerts.BreathRetention.AlertEveryXSeconds
  const fieldTextValue = getObjValueFromString(values.alerts, `${field}.value`);
  const errorTextValue = getObjValueFromString(errors.alerts, `${field}.value`);
  const updateTextFieldString = `alerts.${field}.value`;
  const fieldSoundValue = getObjValueFromString(values.alerts, `${field}.sound`);
  const errorSoundValue = getObjValueFromString(errors.alerts, `${field}.sound`);
  const updateSoundFieldString = `alerts.${field}.sound`;

  const { pickerStates, pickerKey, updatePickerStates } = pickerStateInfo;

  return (
    <View>
      <View style={styles.field}>
        <Text style={styles.inputLabel}>{title}</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={onFieldUpdate.handleChange(updateTextFieldString)}
          value={fieldTextValue}
        />
        <Text style={styles.errorText}>{errorTextValue}</Text>
      </View>
      <View style={[styles.field]}>
        <Text style={styles.inputLabel}> Select Alert Sound</Text>
        <DropDownPicker
          dropDownDirection="BOTTOM"
          zIndex={1000}
          dropDownContainerStyle={{
            backgroundColor: "#fff",
          }}
          open={pickerStates[pickerKey]}
          setOpen={() => updatePickerStates(pickerKey, true)}
          onClose={() => updatePickerStates(pickerKey, false)}
          searchable={true}
          searchPlaceholder="Search for Sound..."
          value={fieldSoundValue}
          items={pickerItems}
          setValue={(fn) => onFieldUpdate.pickerFieldUpdate(updateSoundFieldString, fn)}
          // setItems={setItems}
        />
      </View>
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

export default AlertInput;
