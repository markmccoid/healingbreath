import { AlertSoundNames, AlertSounds, AlertPlayableSounds } from "../utils/sounds/soundTypes";
import { Audio } from "expo-av";
import { useState, useEffect } from "react";

export const alertSounds: AlertSounds = {
  bellding_001: require("../../assets/sounds/bellding_001.mp3"),
  bellding_002: require("../../assets/sounds/bellding_002.mp3"),
  bellding_003: require("../../assets/sounds/bellding_003.mp3"),
  bellding_004: require("../../assets/sounds/bellding_004.mp3"),
  bowlgong_001: require("../../assets/sounds/bowlgong_001.mp3"),
  bowlgong_002: require("../../assets/sounds/bowlgong_002.mp3"),
  bowlgong_003: require("../../assets/sounds/bowlgong_003.mp3"),
  bowlgong_004: require("../../assets/sounds/bowlgong_004.mp3"),
  bowlgong_005: require("../../assets/sounds/bowlgong_005.mp3"),
  bowlgong_006: require("../../assets/sounds/bowlgong_006.mp3"),
  bowlgong_long_001: require("../../assets/sounds/bowlgong_long_001.mp3"),
  bowlgong_long_002: require("../../assets/sounds/bowlgong_long_002.mp3"),
  bowlsinging_001: require("../../assets/sounds/bowlsinging_001.mp3"),
  bowlsinging_002: require("../../assets/sounds/bowlsinging_002.mp3"),
  bowlsinging_long_loop_001: require("../../assets/sounds/bowlsinging_long_loop_001.mp3"),
  ding_001: require("../../assets/sounds/ding_001.mp3"),
  ding_002: require("../../assets/sounds/ding_002.mp3"),
  metalclang_001: require("../../assets/sounds/metalclang_001.mp3"),
  metalgong_001: require("../../assets/sounds/metalgong_001.mp3"),
  metalgong_002: require("../../assets/sounds/metalgong_002.mp3"),
  metalgong_003: require("../../assets/sounds/metalgong_003.mp3"),
  speak_mm_breath_in_and_hold: require("../../assets/sounds/speak_mm_breath_in_and_hold.mp3"),
  speak_mm_breath_out: require("../../assets/sounds/speak_mm_breath_out.mp3"),
  tibentanbowl_001: require("../../assets/sounds/tibentanbowl_001.mp3"),
  tick_001: require("../../assets/sounds/tick_001.mp3"),
};
export const alertSoundNames = Object.keys(alertSounds);

// Global var to hold sample sound played from "loadAndPlaySound" function
const soundToPlay = new Audio.Sound();

// load and play passed name
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
      return await playableAlertSounds[key].unloadAsync();
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

export type PlaySound = (name: AlertSoundNames) => Promise<void>;
export const useAlertSounds = (
  sounds: Partial<AlertSoundNames>[]
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
      console.log("inCallAlertLOad");
      const playableSounds = await loadAlertSounds(sounds);
      setPlayableAlertSounds(playableSounds);
      setSoundsLoaded(true);
    };
    // If no sounds / alerts return
    if (sounds.length === 0 || !sounds) {
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
