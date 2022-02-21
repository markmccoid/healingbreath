import { AlertSoundNames, AlertSounds, AlertPlayableSounds } from "./soundTypes";
import { Audio } from "expo-av";
import React, { useState, useEffect } from "react";

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

  const loadingSounds = Object.keys(alertSounds).map(async (key) => {
    const assetName = key as AlertSoundNames;
    alertPlayableSounds = { ...alertPlayableSounds, [assetName]: new Audio.Sound() };
    // alertPlayableSounds[assetName] = new Audio.Sound();
    await alertPlayableSounds[assetName].loadAsync(alertSounds[assetName]);
  });
  // console.log("loadingsounds", loadingSounds);
  //return await Promise.all(loadingSounds);
  // return Promise.all(loadingSounds);
  await Promise.all(loadingSounds);
  return alertPlayableSounds;
};

// Could call loadSounds from App.tsx, but using a hook is similar to how
// expo loads fonts
export const useLoadSounds = () => {
  const [soundsLoaded, setSoundsLoaded] = React.useState(false);
  React.useEffect(() => {
    const effectLoadSounds = async () => {
      try {
        // console.log("loading sounds started");
        // await loadSounds();
        const results = await loadSounds();
        console.log("loading sounds done");
        setSoundsLoaded(true);
      } catch (e) {
        console.log("error loading sounds", e);
      }
    };
    effectLoadSounds();
    return () => console.log("useLoadSounds Unmounted");
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

//***** LOAD SOUNDS FOR SESSION ******************** */
//***** LOAD SOUNDS FOR SESSION ******************** */
const unloadSounds = async (playableAlertSounds: Partial<AlertPlayableSounds>) => {
  return Promise.all(
    Object.keys(playableAlertSounds).map(async (key) => {
      return await playableAlertSounds[key].unloadAsync();
    })
  );
};

const loadAlertSounds = async (
  sounds: Partial<AlertSoundNames>[]
): Promise<Partial<AlertPlayableSounds>> => {
  // Loads all alertSounds to the local object:
  let playableAlertSounds: Partial<AlertPlayableSounds> = {};
  const loadingSounds = sounds.map(async (key) => {
    const assetName = key as AlertSoundNames;
    playableAlertSounds = { ...playableAlertSounds, [assetName]: new Audio.Sound() };
    // playableAlertSounds[assetName] = new Audio.Sound();
    await playableAlertSounds[assetName].loadAsync(alertSounds[assetName]);
  });

  //return await Promise.all(loadingSounds);
  await Promise.all(loadingSounds);
  return playableAlertSounds;
};

export const useAlertSounds = (sounds: Partial<AlertSoundNames>[]) => {
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const [playableAlertSounds, setPlayableAlertSounds] =
    useState<Partial<AlertPlayableSounds>>();

  if (sounds.length === 0 || !sounds) {
    return;
  }

  const playSound = async (name: AlertSoundNames) => {
    console.log(`plaing sound useAlert--> ${name}`);
    try {
      if (playableAlertSounds?.[name]) {
        await playableAlertSounds[name].replayAsync();
      }
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    // Load the passed array of sounds

    const callAlertLoad = async () => {
      console.log("Awaiting sounds LOAD");
      const playableSounds = await loadAlertSounds(sounds);
      console.log("SOUNDS usealertsounds load");
      playableSounds.gong?.replayAsync();
      setPlayableAlertSounds(playableSounds);
      setSoundsLoaded(true);
    };
    callAlertLoad();
    // when exiting, unload the sounds
    return () => {
      console.log("useAlertSound UNMOUTNING");
      if (playableAlertSounds) {
        unloadSounds(playableAlertSounds);
      }
    };
  }, []);

  return { soundsLoaded, playSound };
};
