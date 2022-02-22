import { AlertSoundNames, AlertSounds, AlertPlayableSounds } from "../utils/sounds/soundTypes";
import { Audio } from "expo-av";
import { useState, useEffect } from "react";
import { set } from "lodash";

export const alertSounds: AlertSounds = {
  gong: require("../../assets/sounds/gong01.wav"),
  churchBell: require("../../assets/sounds/ChurchBell001.mp3"),
  breathInMark: require("../../assets/sounds/BreathInMark.mp3"),
  breathOutMark: require("../../assets/sounds/BreathOutMark.mp3"),
  airplaneDing: require("../../assets/sounds/AirplaneDing.mp3"),
  elevatorDing: require("../../assets/sounds/ElevatorDing.mp3"),
  tick: require("../../assets/sounds/tick.mp3"),
  ding: require("../../assets/sounds/ding.mp3"),
};

export const alertSoundNames = Object.keys(alertSounds);

//***** LOAD SOUNDS FOR SESSION  ******************** */
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

  if (sounds.length === 0 || !sounds) {
    console.log("Sound Length Zero, set soundsloaded to true");
    setSoundsLoaded(true);
  }

  const playSound = async (name: AlertSoundNames) => {
    console.log(`plaing sound useAlert--> ${name}`);
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
    callAlertLoad();
    // when exiting, unload the sounds
    return () => {
      if (playableAlertSounds) {
        unloadSounds(playableAlertSounds);
      }
    };
  }, []);

  return { soundsLoaded, playSound };
};
