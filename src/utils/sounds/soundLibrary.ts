import { AlertSoundNames, AlertSounds, AlertPlayableSounds } from "./soundTypes";
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

  const loadingSounds = Object.keys(alertSounds).map((key) => {
    const assetName = key as AlertSoundNames;
    alertPlayableSounds = { ...alertPlayableSounds, [assetName]: new Audio.Sound() };
    // alertPlayableSounds[assetName] = new Audio.Sound();
    return alertPlayableSounds[assetName].loadAsync(alertSounds[assetName]);
  });
  return await Promise.all(loadingSounds);
};

// Could call loadSounds from App.tsx, but using a hook is similar to how
// expo loads fonts
export const useLoadSounds = () => {
  const [soundsLoaded, setSoundsLoaded] = React.useState(false);
  React.useEffect(() => {
    const effectLoadSounds = async () => {
      try {
        // console.log("loading sounds started");
        await loadSounds();
        console.log("loading sounds done");
        setSoundsLoaded(true);
      } catch (e) {
        console.log("error loading sounds", e);
      }
    };
    effectLoadSounds();
  }, []);
  return [soundsLoaded];
};

// Will play the passed asset names sound
export const playSound = async (name: AlertSoundNames) => {
  console.log(`plaing sound --> ${name}`);
  try {
    if (alertPlayableSounds[name]) {
      await alertPlayableSounds[name].replayAsync();
    }
  } catch (error) {
    console.warn(error);
  }
};
