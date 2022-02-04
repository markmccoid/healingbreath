import { AssetNames, AlertSounds, AlertPlayableSounds } from "./soundTypes";
import { Audio } from "expo-av";
import React from "react";

let alertPlayableSounds: AlertPlayableSounds;

export const alertSounds: AlertSounds = {
  gong: require("../../../assets/sounds/gong01.wav"),
  churchBell: require("../../../assets/sounds/ChurchBell001.mp3"),
  breathInMark: require("../../../assets/sounds/BreathInMark.mp3"),
  breathOutMark: require("../../../assets/sounds/BreathOutMark.mp3"),
  airplaneDing: require("../../../assets/sounds/AirplaneDing.mp3"),
  elevatorDing: require("../../../assets/sounds/ElevatorDing.mp3"),
  tick: require("../../../assets/sounds/tick.mp3"),
  ding: require("../../../assets/sounds/ding.mp3"),
};

export const loadSounds = async () => {
  // Loads all alertSounds to the global object:
  //-- alertPlayableSounds
  await Promise.all(
    Object.keys(alertSounds).map((key) => {
      const assetName = key as AssetNames;
      alertPlayableSounds = { ...alertPlayableSounds, [assetName]: new Audio.Sound() };
      // alertPlayableSounds[assetName] = new Audio.Sound();
      return alertPlayableSounds[assetName].loadAsync(alertSounds[assetName]);
    })
  );
};

// Could call loadSounds from App.tsx, but using a hook is similar to how
// expo loads fonts
export const useLoadSounds = () => {
  const [soundsLoaded, setSoundsLoaded] = React.useState(false);
  React.useEffect(() => {
    const effectLoadSounds = async () => {
      await loadSounds();
      setSoundsLoaded(true);
    };
    effectLoadSounds();
  }, []);
  return [soundsLoaded];
};

// Will play the passed asset names sound
export const playSound = async (name: AssetNames) => {
  console.log(`plaing sound --> ${name}`);
  try {
    if (alertPlayableSounds[name]) {
      await alertPlayableSounds[name].replayAsync();
    }
  } catch (error) {
    console.warn(error);
  }
};
