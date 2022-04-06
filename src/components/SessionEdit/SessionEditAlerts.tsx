import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView } from "react-native";
import { FormikErrors, FormikHandlers, FormikTouched } from "formik";
import { BreathSessionValues } from "./sessionEditHelpers";
import { alertSoundNames } from "../../hooks/useAlertSounds";
import DropDownPicker from "react-native-dropdown-picker";
import { loadAndPlaySound } from "../../hooks/useAlertSounds";
import { AlertSoundNames } from "../../utils/sounds/soundTypes";
import { soundLibrary } from "../../utils/sounds/soundLibrary";
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

const pickerAlertSounds2 = alertSoundNames.map((sound) => ({
  label: sound,
  value: sound,
}));

const pickerAlertSounds = soundLibrary.map((soundObj) => ({
  label: soundObj.displayName,
  value: soundObj.id,
}));
export type AlertFields = {
  cfbEveryXBreaths: boolean;
  cfbXBreathsBeforeEnd: boolean;
  cfbSoundOnFirstBreath: boolean;
  cfbSoundOnLastBreath: boolean;
  brEveryXSeconds: boolean;
  brXSecondsBeforeEnd: boolean;
  rbEveryXSeconds: boolean;
  rbXSecondsBeforeEnd: boolean;
  rbAlertBreathInPause: boolean;
  rbAlertBreathOutPause: boolean;
};
// export type AlertFields = {
//   cfbEveryXBreaths: string;
//   cfbXBreathsBeforeEnd: string;
//   cfbSoundOnFirstBreath: string;
//   cfbSoundOnLastBreath: string;
//   brEveryXSeconds: string;
//   brXSecondsBeforeEnd: string;
//   rbEveryXSeconds: string;
//   rbXSecondsBeforeEnd: string;
//   rbAlertBreathInPause: string;
//   rbAlertBreathOutPause: string;
// };

type SoundPickerStates = {
  [Property in keyof AlertFields]: boolean;
};

// Used as a unique key in the dropdown component.  Need one for each sound
// used so that when on picker opens, others close.
const alertFields: AlertFields = {
  cfbEveryXBreaths: false,
  cfbXBreathsBeforeEnd: false,
  cfbSoundOnFirstBreath: false,
  cfbSoundOnLastBreath: false,
  brEveryXSeconds: false,
  brXSecondsBeforeEnd: false,
  rbEveryXSeconds: false,
  rbXSecondsBeforeEnd: false,
  rbAlertBreathInPause: false,
  rbAlertBreathOutPause: false,
};
// const alertFields: AlertFields = {
//   cfbEveryXBreaths: "ConsciousForcedBreathing.alertEveryXBreaths",
//   cfbXBreathsBeforeEnd: "ConsciousForcedBreathing.alertXBreathsBeforeEnd",
//   cfbSoundOnFirstBreath: "ConsciousForcedBreathing.alertSoundOnFirstBreath",
//   cfbSoundOnLastBreath: "ConsciousForcedBreathing.alertSoundOnLastBreath",
//   brEveryXSeconds: "BreathRetention.alertEveryXSeconds",
//   brXSecondsBeforeEnd: "BreathRetention.alertXSecondsBeforeEnd",
//   rbEveryXSeconds: "RecoveryBreath.alertEveryXSeconds",
//   rbXSecondsBeforeEnd: "RecoveryBreath.alertXSecondsBeforeEnd",
//   rbAlertBreathInPause: "RecoveryBreath.alertBreathInPause",
//   rbAlertBreathOutPause: "RecoveryBreath.alertBreathOutPause",
// };

const defaultPickerStates = Object.entries(alertFields).reduce(
  (final, [key, val]) => ({ ...final, [key]: false }),
  {}
) as SoundPickerStates;

function SessionEditAlerts({ values, errors, touched, handleBlur, handleChange }: Props) {
  const [items, setItems] = useState(pickerAlertSounds);
  const [pickerStates, setPickerStates] = React.useState<AlertFields>(alertFields);
  // const [pickerStates, setPickerStates] = React.useState<SoundPickerStates>(defaultPickerStates);

  const updatePickerStates = (pickerKey: string, isOpen: boolean) => {
    // update whatever picker is calling this to passed state,
    // ALL other pickers set to false (closed), hence using ...defaultPickerStates
    // NOTE: this also causes all pickers to close when I manually (controller.close())
    // the genre picker in response to being at a snapPointIndex <=1
    setPickerStates({ ...defaultPickerStates, [pickerKey]: isOpen });
  };

  const closeAllPickers = () => {
    setPickerStates({ ...defaultPickerStates });
  };
  const onFieldUpdate = (fieldName: string, fn: () => AlertSoundNames) => {
    const newValue = fn();
    handleChange(fieldName)(newValue);
    loadAndPlaySound(newValue);
  };

  return (
    // <View style={styles.alertContainer}>
    <KeyboardAvoidingView
      style={{
        flexGrow: 1,
      }}
      behavior="padding"
      enabled
      keyboardVerticalOffset={150}
    >
      <ScrollView
        style={{ marginHorizontal: 10, flex: 1, marginBottom: 15, paddingTop: 50 }}
        contentContainerStyle={{ paddingBottom: 250 }}
      >
        {/*-----------------------1-----
        - Conscious Forced Breathing -
        ------------------------------- */}
        <View style={{ zIndex: 600, flexGrow: 1 }}>
          <View style={styles.alertTitleView}>
            <Text style={styles.alertTitleText}>Conscious Forced Breathing</Text>
          </View>
          <View
            style={[
              styles.individualAlertContainer,
              {
                zIndex:
                  pickerStates.cfbSoundOnFirstBreath || pickerStates.cfbSoundOnLastBreath
                    ? 600
                    : 100,
                flexDirection: "row",
              },
            ]}
          >
            <View style={{ justifyContent: "flex-start", flex: 1, marginRight: 5 }}>
              <AlertSoundPicker
                pickerItems={items}
                values={values}
                errors={errors}
                field="ConsciousForcedBreathing.soundOnFirstBreath"
                onFieldUpdate={{ pickerFieldUpdate: onFieldUpdate, handleChange }}
                pickerStateInfo={{
                  pickerStates,
                  updatePickerStates,
                  pickerKey: "cfbSoundOnFirstBreath",
                }}
                title="First Breath Sound"
              />
            </View>
            <View style={{ justifyContent: "flex-start", flex: 1, marginLeft: 5 }}>
              <AlertSoundPicker
                pickerItems={items}
                values={values}
                errors={errors}
                field="ConsciousForcedBreathing.soundOnLastBreath"
                onFieldUpdate={{ pickerFieldUpdate: onFieldUpdate, handleChange }}
                pickerStateInfo={{
                  pickerStates,
                  updatePickerStates,
                  pickerKey: "cfbSoundOnLastBreath",
                  // pickerKey: alertFields.cfbSoundOnLastBreath,
                }}
                title="Last Breath Sound"
              />
            </View>
          </View>
          <View style={{ zIndex: pickerStates.cfbEveryXBreaths ? 600 : 100 }}>
            <AlertInput
              pickerItems={items}
              values={values}
              errors={errors}
              touched={touched}
              handleBlur={handleBlur}
              handleFocus={closeAllPickers}
              field="ConsciousForcedBreathing.alertEveryXBreaths"
              onFieldUpdate={{ pickerFieldUpdate: onFieldUpdate, handleChange }}
              pickerStateInfo={{
                pickerStates,
                updatePickerStates,
                pickerKey: "cfbEveryXBreaths",
                // pickerKey: alertFields.cfbEveryXBreaths,
              }}
              title="Alert Every X Breaths"
            />
          </View>
          <View style={{ zIndex: 550 }}>
            <AlertInput
              pickerItems={items}
              values={values}
              errors={errors}
              touched={touched}
              handleBlur={handleBlur}
              field="ConsciousForcedBreathing.alertXBreathsBeforeEnd"
              onFieldUpdate={{ pickerFieldUpdate: onFieldUpdate, handleChange }}
              handleFocus={closeAllPickers}
              pickerStateInfo={{
                pickerStates,
                updatePickerStates,
                pickerKey: "cfbXBreathsBeforeEnd",
              }}
              title="Alert X Breaths Before End"
            />
          </View>
        </View>

        {/*----------------------------
        - Breath Retention            -
        ------------------------------- */}
        <View style={{ zIndex: 500 }}>
          <View style={styles.alertTitleView}>
            <Text style={styles.alertTitleText}>Breath Retention</Text>
          </View>
          <View style={{ zIndex: 500 }}>
            <AlertInput
              pickerItems={items}
              values={values}
              errors={errors}
              touched={touched}
              handleBlur={handleBlur}
              handleFocus={closeAllPickers}
              field="BreathRetention.alertEveryXSeconds"
              onFieldUpdate={{ pickerFieldUpdate: onFieldUpdate, handleChange }}
              pickerStateInfo={{
                pickerStates,
                updatePickerStates,
                pickerKey: "brEveryXSeconds",
              }}
              title="Alert Every X Seconds"
            />
          </View>
          <View style={{ zIndex: 450 }}>
            <AlertInput
              pickerItems={items}
              values={values}
              errors={errors}
              touched={touched}
              handleBlur={handleBlur}
              handleFocus={closeAllPickers}
              field="BreathRetention.alertXSecondsBeforeEnd"
              onFieldUpdate={{ pickerFieldUpdate: onFieldUpdate, handleChange }}
              pickerStateInfo={{
                pickerStates,
                updatePickerStates,
                pickerKey: "brXSecondsBeforeEnd",
              }}
              title="Alert X Seconds Before End"
            />
          </View>
        </View>

        {/*----------------------------
        - Breath Retention            -
        ------------------------------- */}
        <View style={{ zIndex: 400 }}>
          <View style={styles.alertTitleView}>
            <Text style={styles.alertTitleText}>Recovery Breath</Text>
          </View>

          <View
            style={[
              styles.individualAlertContainer,
              {
                zIndex:
                  pickerStates.rbAlertBreathInPause || pickerStates.rbAlertBreathOutPause
                    ? 600
                    : 100,
                flexDirection: "column",
              },
            ]}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                zIndex: pickerStates.rbAlertBreathInPause ? 600 : 100,
              }}
            >
              <Text style={[styles.inputLabel, { width: 85 }]}>In Breath</Text>
              <View style={{ flex: 1 }}>
                <AlertSoundPicker
                  pickerItems={items}
                  values={values}
                  errors={errors}
                  field="RecoveryBreath.alertBreathInPause"
                  onFieldUpdate={{ pickerFieldUpdate: onFieldUpdate, handleChange }}
                  pickerStateInfo={{
                    pickerStates,
                    updatePickerStates,
                    pickerKey: "rbAlertBreathInPause",
                  }}
                  title="Recovery Breath In Sound"
                  labelStyle={{ display: "none" }}
                />
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                zIndex: pickerStates.rbAlertBreathOutPause ? 600 : 100,
              }}
            >
              <Text style={[styles.inputLabel, { width: 85 }]}>Out Breath</Text>
              <View style={{ flex: 1 }}>
                <AlertSoundPicker
                  pickerItems={items}
                  values={values}
                  errors={errors}
                  field="RecoveryBreath.alertBreathOutPause"
                  onFieldUpdate={{ pickerFieldUpdate: onFieldUpdate, handleChange }}
                  pickerStateInfo={{
                    pickerStates,
                    updatePickerStates,
                    pickerKey: "rbAlertBreathOutPause",
                  }}
                  title="Recovery Breath Out Sound"
                  labelStyle={{ display: "none" }}
                />
              </View>
            </View>
          </View>

          <View style={{ zIndex: 350 }}>
            <AlertInput
              pickerItems={items}
              values={values}
              errors={errors}
              touched={touched}
              handleBlur={handleBlur}
              handleFocus={closeAllPickers}
              field="RecoveryBreath.alertEveryXSeconds"
              onFieldUpdate={{ pickerFieldUpdate: onFieldUpdate, handleChange }}
              pickerStateInfo={{
                pickerStates,
                updatePickerStates,
                pickerKey: "rbEveryXSeconds",
              }}
              title="Alert Every X Seconds"
            />
          </View>
          <View style={{ zIndex: 300 }}>
            <AlertInput
              pickerItems={items}
              values={values}
              errors={errors}
              touched={touched}
              handleBlur={handleBlur}
              handleFocus={closeAllPickers}
              field="RecoveryBreath.alertXSecondsBeforeEnd"
              onFieldUpdate={{ pickerFieldUpdate: onFieldUpdate, handleChange }}
              pickerStateInfo={{
                pickerStates,
                updatePickerStates,
                pickerKey: "rbXSecondsBeforeEnd",
              }}
              title="Alert X Seconds Before End"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    // </View>
  );
}

export default SessionEditAlerts;
