import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { FormikErrors, FormikHandlers } from "formik";
import { BreathSessionValues } from "./sessionEditHelpers";
import { alertSoundNames } from "../../hooks/useAlertSounds";
import DropDownPicker from "react-native-dropdown-picker";
import { loadAndPlaySound } from "../../hooks/useAlertSounds";
import { AlertSoundNames } from "../../utils/sounds/soundTypes";
import AlertInput from "./AlertInput";

type Props = {
  values: BreathSessionValues;
  errors: FormikErrors<BreathSessionValues>;
  handleChange: FormikHandlers["handleChange"];
};

const pickerAlertSounds = alertSoundNames.map((sound) => ({
  label: sound,
  value: sound,
}));

export type PickerStates = {
  [key: string]: boolean;
};

export type AlertFields = {
  cfbEveryXBreaths: string;
  cfbXBreathsBeforeEnd: string;
  brEveryXSeconds: string;
  brXSecondsBeforeEnd: string;
  rbEveryXSeconds: string;
  rbXSecondsBeforeEnd: string;
};
const alertFields: AlertFields = {
  cfbEveryXBreaths: "ConsciousForcedBreathing.alertEveryXBreaths",
  cfbXBreathsBeforeEnd: "ConsciousForcedBreathing.alertXBreathsBeforeEnd",
  brEveryXSeconds: "BreathRetention.alertEveryXSeconds",
  brXSecondsBeforeEnd: "BreathRetention.alertXSecondsBeforeEnd",
  rbEveryXSeconds: "RecoveryBreath.alertEveryXSeconds",
  rbXSecondsBeforeEnd: "RecoveryBreath.alertXSecondsBeforeEnd",
};

const defaultPickerStates = Object.entries(alertFields).reduce(
  (final, [key, val]) => ({ ...final, [key]: false }),
  {}
);

function SessionEditAlerts({ values, errors, handleChange }: Props) {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  const [items, setItems] = useState(pickerAlertSounds);
  const [pickerStates, setPickerStates] = React.useState(defaultPickerStates);

  const updatePickerStates = (pickerKey: string, isOpen: boolean) => {
    // update whatever picker is calling this to passed state,
    // ALL other pickers set to false (closed), hence using ...defaultPickerStates
    // NOTE: this also causes all pickers to close when I manually (controller.close())
    // the genre picker in response to being at a snapPointIndex <=1
    setPickerStates({ ...defaultPickerStates, [pickerKey]: isOpen });
  };

  const onFieldUpdate = (fieldName: string, fn: () => AlertSoundNames) => {
    const newValue = fn();
    console.log("Field Update", fieldName, newValue);
    handleChange(fieldName)(newValue);
    loadAndPlaySound(newValue);
  };

  // React.useEffect(() => {
  //   if (value) {
  //     handleChange("alerts.ConsciousForcedBreathing.alertEveryXBreaths.sound")(value);
  //     loadAndPlaySound(value);
  //   }
  // }, [value]);

  return (
    <View>
      {/* <View style={styles.field}>
        <Text style={styles.inputLabel}>Alert Every X Breaths</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Alert Every X Breaths"
          onChangeText={handleChange(
            "alerts.ConsciousForcedBreathing.alertEveryXBreaths.value"
          )}
          value={CFBAlerts?.alertEveryXBreaths?.value}
        />
        <Text style={styles.errorText}>{CFBErrors?.alertEveryXBreaths?.value}</Text>
      </View> */}
      {/*----------------------------
      - Conscious Forced Breathing -
      ------------------------------- */}
      <View style={{ zIndex: 6000 }}>
        <Text>Conscious Forced Breathing</Text>
        <View style={{ zIndex: 6000 }}>
          <AlertInput
            pickerItems={items}
            values={values}
            errors={errors}
            field="ConsciousForcedBreathing.alertEveryXBreaths"
            onFieldUpdate={{ pickerFieldUpdate: onFieldUpdate, handleChange }}
            pickerStateInfo={{
              pickerStates,
              updatePickerStates,
              pickerKey: alertFields.cfbEveryXBreaths,
            }}
            title="Alert Every X Breaths"
          />
        </View>
        <View style={{ zIndex: 5500 }}>
          <AlertInput
            pickerItems={items}
            values={values}
            errors={errors}
            field="ConsciousForcedBreathing.alertXBreathsBeforeEnd"
            onFieldUpdate={{ pickerFieldUpdate: onFieldUpdate, handleChange }}
            pickerStateInfo={{
              pickerStates,
              updatePickerStates,
              pickerKey: alertFields.cfbXBreathsBeforeEnd,
            }}
            title="Alert X Breaths Before End"
          />
        </View>
      </View>

      {/*----------------------------
      - Breath Retention            -
      ------------------------------- */}
      <View style={{ zIndex: 5000 }}>
        <Text>Breath Retention</Text>
        <View style={{ zIndex: 5000 }}>
          <AlertInput
            pickerItems={items}
            values={values}
            errors={errors}
            field="BreathRetention.alertEveryXSeconds"
            onFieldUpdate={{ pickerFieldUpdate: onFieldUpdate, handleChange }}
            pickerStateInfo={{
              pickerStates,
              updatePickerStates,
              pickerKey: alertFields.brEveryXSeconds,
            }}
            title="Alert Every X Seconds"
          />
        </View>
        <View style={{ zIndex: 4500 }}>
          <AlertInput
            pickerItems={items}
            values={values}
            errors={errors}
            field="BreathRetention.alertXSecondsBeforeEnd"
            onFieldUpdate={{ pickerFieldUpdate: onFieldUpdate, handleChange }}
            pickerStateInfo={{
              pickerStates,
              updatePickerStates,
              pickerKey: alertFields.brXSecondsBeforeEnd,
            }}
            title="Alert X Seconds Before End"
          />
        </View>
      </View>

      {/*----------------------------
      - Breath Retention            -
      ------------------------------- */}
      <View style={{ zIndex: 4000 }}>
        <Text>Recovery Breath</Text>
        <View style={{ zIndex: 3500 }}>
          <AlertInput
            pickerItems={items}
            values={values}
            errors={errors}
            field="RecoveryBreath.alertEveryXSeconds"
            onFieldUpdate={{ pickerFieldUpdate: onFieldUpdate, handleChange }}
            pickerStateInfo={{
              pickerStates,
              updatePickerStates,
              pickerKey: alertFields.rbEveryXSeconds,
            }}
            title="Alert Every X Seconds"
          />
        </View>
        <View style={{ zIndex: 3000 }}>
          <AlertInput
            pickerItems={items}
            values={values}
            errors={errors}
            field="RecoveryBreath.alertXSecondsBeforeEnd"
            onFieldUpdate={{ pickerFieldUpdate: onFieldUpdate, handleChange }}
            pickerStateInfo={{
              pickerStates,
              updatePickerStates,
              pickerKey: alertFields.rbXSecondsBeforeEnd,
            }}
            title="Alert X Seconds Before End"
          />
        </View>
      </View>

      {/* <AlertInput
        items={items}
        setIsOpen={setOpen}
        isOpen={open}
        values={values}
        errors={errors}
        field="ConsciousForcedBreathing.alertEveryXBreaths.sound"
        updateFunction={(fn) =>
          onFieldUpdate("alerts.ConsciousForcedBreathing.alertEveryXBreaths.sound", fn)
        }
      /> */}

      {/* <View style={styles.field}>
        <Text style={styles.inputLabel}>Alert X Breaths Before Last</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Alert X Breaths before End"
          onChangeText={handleChange(
            "alerts.ConsciousForcedBreathing.alertXBreathsBeforeEnd.value"
          )}
          value={CFBAlerts?.alertXBreathsBeforeEnd?.value}
        />
        <Text style={styles.errorText}>{CFBErrors?.alertXBreathsBeforeEnd?.value}</Text>
      </View>
      <View style={styles.field}>
        <DropDownPicker
          zIndex={2000}
          zIndexInverse={2000}
          open={open2}
          searchable={true}
          searchPlaceholder="Search for Sound..."
          value={CFBAlerts?.alertXBreathsBeforeEnd?.sound}
          items={items}
          setOpen={setOpen2}
          setValue={(fn) =>
            onFieldUpdate("alerts.ConsciousForcedBreathing.alertXBreathsBeforeEnd.sound", fn)
          }
          // setItems={setItems}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.inputLabel}>Alert Every X Seconds</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Alert Every X Seconds"
          onChangeText={handleChange("alerts.BreathRetention.alertEveryXSeconds.value")}
          value={BRAlerts?.alertEveryXSeconds?.value}
        />
        <Text style={styles.errorText}>{BRErrors?.alertEveryXSeconds?.value}</Text>
      </View>
      <View style={styles.field}>
        <DropDownPicker
          open={open3}
          searchable={true}
          searchPlaceholder="Search for Sound..."
          value={BRAlerts?.alertEveryXSeconds?.sound}
          items={items}
          setOpen={setOpen3}
          setValue={(fn) =>
            onFieldUpdate("alerts.BreathRetention.alertEveryXSeconds.sound", fn)
          }
          // setItems={setItems}
        />
      </View> */}
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
