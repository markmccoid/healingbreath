import { AlertSoundNames, AlertSounds, AlertPlayableSounds } from "../utils/sounds/soundTypes";
import { Audio } from "expo-av";
import { Asset } from "expo-asset";
import { useState, useEffect } from "react";

import { alertSounds } from "../utils/sounds/soundLibrary";
// A list of keys from the alertSounds object
export const alertSoundNames = Object.keys(alertSounds);

// Global var to hold sample sound played from "loadAndPlaySound" function
const soundToPlay = new Audio.Sound();

//*================
//* load and play passed name
//*================
export const loadAndPlaySound = async (soundName: AlertSoundNames) => {
  // first unload if other sound is loaded
  try {
    await soundToPlay.unloadAsync();
  } catch (err) {
    console.log("Unloading Sound error", err);
  }
  try {
    await soundToPlay.loadAsync(alertSounds[soundName]);
    await soundToPlay.playAsync();
  } catch (err) {
    console.log(`Error playing sample ${soundName} - ${err}`);
  }
};

//***** UNLOAD SOUNDS Currently Loaded  ******************** */
const unloadSounds = async (playableAlertSounds: Partial<AlertPlayableSounds>) => {
  return Promise.all(
    Object.keys(playableAlertSounds).map(async (key) => {
      const soundName = key as AlertSoundNames;
      return await playableAlertSounds?.[soundName]?.unloadAsync();
    })
  );
};

//***** LOAD SOUNDS FOR SESSION  ******************** */
const loadAlertSounds = async (
  sounds: Partial<AlertSoundNames>[]
): Promise<Partial<AlertPlayableSounds>> => {
  // Loads all alertSounds to the local object:
  let playableAlertSounds: Partial<AlertPlayableSounds> = {};
  const loadingSounds = sounds.map(async (key) => {
    const assetName = key as Partial<AlertSoundNames>;
    playableAlertSounds = { ...playableAlertSounds, [assetName]: new Audio.Sound() };
    // playableAlertSounds[assetName] = new Audio.Sound();

    return await playableAlertSounds?.[assetName]?.loadAsync(alertSounds[assetName]);
  });

  //return await Promise.all(loadingSounds);
  await Promise.all(loadingSounds);
  return playableAlertSounds;
};

//*================
//* useAlertSounds
//*================
export type PlaySound = (name: AlertSoundNames) => Promise<void>;
export const useAlertSounds = (
  sounds: Partial<AlertSoundNames>[] | undefined
): { soundsLoaded: boolean; playSound: PlaySound } => {
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const [playableAlertSounds, setPlayableAlertSounds] =
    useState<Partial<AlertPlayableSounds>>();

  const playSound = async (name: AlertSoundNames) => {
    // console.log(`plaing sound useAlert--> ${name}`);
    try {
      if (playableAlertSounds?.[name]) {
        await playableAlertSounds?.[name]?.replayAsync();
      }
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    // Load the passed array of sounds
    const callAlertLoad = async () => {
      const playableSounds = await loadAlertSounds(sounds);
      setPlayableAlertSounds(playableSounds);
      setSoundsLoaded(true);
    };
    // If no sounds / alerts return
    if (sounds?.length === 0 || !sounds) {
      console.log("Sound Length Zero, set soundsloaded to true");
      setSoundsLoaded(true);
    } else {
      callAlertLoad();
    }
    // when exiting, unload the sounds
    return () => {
      if (playableAlertSounds) {
        unloadSounds(playableAlertSounds);
      }
    };
  }, []);

  return { soundsLoaded, playSound };
};
