import { FormikErrors } from "formik";
import React from "react";
import { View, Text, Dimensions } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { getObjValueFromString } from "../../utils/helpers";
import { AlertSoundNames } from "../../utils/sounds/soundTypes";
import { BreathSessionValues } from "./sessionEditHelpers";
import AlertSoundPicker from "./AlertSoundPicker";
import { NumberInput } from "./Inputs";
import { styles } from "./styles";

const { width, height } = Dimensions.get("window");

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

function AlertInput(props: Props) {
  const { values, errors, field, onFieldUpdate, title, pickerStateInfo, pickerItems } = props;
  // Get the value from the formik values object.
  // in essense constructs values.alerts.BreathRetention.AlertEveryXSeconds
  const fieldTextValue = getObjValueFromString(values.alerts, `${field}.value`);
  const errorTextValue = getObjValueFromString(errors.alerts, `${field}.value`);
  const updateTextFieldString = `alerts.${field}.value`;
  const breathsOrSeconds = title.toLowerCase().includes("breaths") ? "Breaths" : "Seconds";
  // const fieldSoundValue = getObjValueFromString(values.alerts, `${field}.sound`);
  // const errorSoundValue = getObjValueFromString(errors.alerts, `${field}.sound`);
  // const updateSoundFieldString = `alerts.${field}.sound`;

  // const { pickerStates, pickerKey, updatePickerStates } = pickerStateInfo;

  return (
    <View style={styles.individualAlertContainer}>
      <Text style={{ textAlign: "left", fontSize: 18, fontWeight: "500" }}>{title}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View>
          <Text style={styles.inputLabel}>{breathsOrSeconds}</Text>
          <NumberInput
            style={{ height: 35, textAlign: "center" }}
            onChangeText={onFieldUpdate.handleChange(updateTextFieldString)}
            value={fieldTextValue}
            includeDecimal={false}
            maxLength={3}
          />
          {errorTextValue && <Text style={styles.errorText}>{errorTextValue}</Text>}
        </View>
        <View style={{ justifyContent: "flex-start", flex: 1, marginHorizontal: 10 }}>
          <AlertSoundPicker {...props} />
        </View>
      </View>
      {/* <View style={[styles.field]}>
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
      </View> */}
    </View>
  );
}

export default AlertInput;
