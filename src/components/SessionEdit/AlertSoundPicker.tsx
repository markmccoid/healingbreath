import { FormikErrors } from "formik";
import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { getObjValueFromString } from "../../utils/helpers";
import { AlertSoundNames } from "../../utils/sounds/soundTypes";
import { BreathSessionValues } from "./sessionEditHelpers";
import { styles } from "./styles";

type Props = {
  values: BreathSessionValues;
  errors: FormikErrors<BreathSessionValues>;
  field: string;
  onFieldUpdate: {
    pickerFieldUpdate: (fieldName: string, fn: () => AlertSoundNames) => void;
    handleChange?: (field: string) => void;
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

function AlertSoundPicker({
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
  const fieldSoundValue = getObjValueFromString(values.alerts, `${field}.sound`);
  // should be an error ever since we are controlling what the user can select
  // const errorSoundValue = getObjValueFromString(errors.alerts, `${field}.sound`);
  // for use in setting up function to update field in formik
  const updateSoundFieldString = `alerts.${field}.sound`;

  const { pickerStates, pickerKey, updatePickerStates } = pickerStateInfo;

  return (
    <View>
      <Text style={styles.inputLabel}> Select Alert Sound</Text>
      <DropDownPicker
        dropDownDirection="BOTTOM"
        zIndex={1000}
        dropDownContainerStyle={{
          backgroundColor: "#fff",
        }}
        closeAfterSelecting={false}
        style={{ height: 35 }}
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
  );
}

export default AlertSoundPicker;
