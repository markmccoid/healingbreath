import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { FormikErrors, FormikHandlers, FormikTouched } from "formik";
import { BreathSessionValues } from "./sessionEditHelpers";
import { alertSoundNames } from "../../hooks/useAlertSounds";
import DropDownPicker from "react-native-dropdown-picker";
import { loadAndPlaySound } from "../../hooks/useAlertSounds";
import { AlertSoundNames } from "../../utils/sounds/soundTypes";
import AlertInput from "./AlertInput";
import AlertSoundPicker from "./AlertSoundPicker";
import { styles } from "./styles";

type Props = {
  values: BreathSessionValues;
  errors: FormikErrors<BreathSessionValues>;
  handleChange: FormikHandlers["handleChange"];
  touched: FormikTouched<BreathSessionValues>;
  handleBlur: FormikHandlers["handleBlur"];
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
  rbAlertBreathInPause: string;
  rbAlertBreathOutPause: string;
};

// Used as a unique key in the dropdown component.  Need one for each sound
// used so that when on picker opens, others close.
const alertFields: AlertFields = {
  cfbEveryXBreaths: "ConsciousForcedBreathing.alertEveryXBreaths",
  cfbXBreathsBeforeEnd: "ConsciousForcedBreathing.alertXBreathsBeforeEnd",
  brEveryXSeconds: "BreathRetention.alertEveryXSeconds",
  brXSecondsBeforeEnd: "BreathRetention.alertXSecondsBeforeEnd",
  rbEveryXSeconds: "RecoveryBreath.alertEveryXSeconds",
  rbXSecondsBeforeEnd: "RecoveryBreath.alertXSecondsBeforeEnd",
  rbAlertBreathInPause: "RecoveryBreath.alertBreathInPause",
  rbAlertBreathOutPause: "RecoveryBreath.alertBreathOutPause",
};

const defaultPickerStates = Object.entries(alertFields).reduce(
  (final, [key, val]) => ({ ...final, [key]: false }),
  {}
);

function SessionEditAlerts({ values, errors, touched, handleBlur, handleChange }: Props) {
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
    handleChange(fieldName)(newValue);
    loadAndPlaySound(newValue);
  };

  return (
    // <View style={styles.alertContainer}>
    <ScrollView
      style={{ marginHorizontal: 10, flex: 1, marginBottom: 15, paddingTop: 50 }}
      contentContainerStyle={{ paddingBottom: 150 }}
    >
      {/*-----------------------1-----
        - Conscious Forced Breathing -
        ------------------------------- */}
      <View style={{ zIndex: 6000 }}>
        <View style={styles.alertTitleView}>
          <Text style={styles.alertTitleText}>Conscious Forced Breathing</Text>
        </View>
        <View style={{ zIndex: 6000 }}>
          <AlertInput
            pickerItems={items}
            values={values}
            errors={errors}
            touched={touched}
            handleBlur={handleBlur}
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
            touched={touched}
            handleBlur={handleBlur}
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
        <View style={styles.alertTitleView}>
          <Text style={styles.alertTitleText}>Breath Retention</Text>
        </View>
        <View style={{ zIndex: 5000 }}>
          <AlertInput
            pickerItems={items}
            values={values}
            errors={errors}
            touched={touched}
            handleBlur={handleBlur}
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
            touched={touched}
            handleBlur={handleBlur}
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
        <View style={styles.alertTitleView}>
          <Text style={styles.alertTitleText}>Recovery Breath</Text>
        </View>
        <View style={{ zIndex: 3500 }}>
          <AlertInput
            pickerItems={items}
            values={values}
            errors={errors}
            touched={touched}
            handleBlur={handleBlur}
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
            touched={touched}
            handleBlur={handleBlur}
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
      <View style={{ zIndex: 3000 }}>
        <View style={styles.alertTitleView}>
          <Text style={styles.alertTitleText}>Breath In Sound</Text>
        </View>
        <View style={styles.individualAlertContainer}>
          <AlertSoundPicker
            pickerItems={items}
            values={values}
            errors={errors}
            field="RecoveryBreath.alertBreathInPause"
            onFieldUpdate={{ pickerFieldUpdate: onFieldUpdate, handleChange }}
            pickerStateInfo={{
              pickerStates,
              updatePickerStates,
              pickerKey: alertFields.rbAlertBreathInPause,
            }}
            title="Alert Breath In Sound"
          />
        </View>
      </View>
      <View style={{ zIndex: 2900 }}>
        <View style={styles.alertTitleView}>
          <Text style={styles.alertTitleText}>Breath Out Sound</Text>
        </View>
        <View style={styles.individualAlertContainer}>
          <AlertSoundPicker
            pickerItems={items}
            values={values}
            errors={errors}
            field="RecoveryBreath.alertBreathOutPause"
            onFieldUpdate={{ pickerFieldUpdate: onFieldUpdate, handleChange }}
            pickerStateInfo={{
              pickerStates,
              updatePickerStates,
              pickerKey: alertFields.rbAlertBreathOutPause,
            }}
            title="Alert Breath Out Sound"
          />
        </View>
      </View>
    </ScrollView>
    // </View>
  );
}

export default SessionEditAlerts;
