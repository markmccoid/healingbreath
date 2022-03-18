import { View, Text, Dimensions, StyleSheet, Pressable } from "react-native";
import React from "react";
import Animated, {
  useSharedValue,
  withTiming,
  withRepeat,
  useAnimatedStyle,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { colors, styleHelpers } from "../../../theme";

const { width, height } = Dimensions.get("window");

type Props = {
  toggleExtendSession: () => void;
  isExtending: boolean;
  isPaused: boolean;
};
const BUTTON_WIDTH = width / 3;
const BUTTON_HEIGHT = 60;

const ExtendAnimation = ({ isExtending, isPaused, toggleExtendSession }: Props) => {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    if (isPaused) {
      progress.value = withTiming(0, { duration: 1500 });
      return;
    }
    if (isExtending) {
      progress.value = withRepeat(
        withTiming(1, { duration: 4500, easing: Easing.bounce }),
        0,
        true
      );
    } else {
      progress.value = withTiming(0, { duration: 500 });
    }
  }, [isExtending, isPaused]);

  const animStyle = useAnimatedStyle(() => {
    const extendWidth = interpolate(progress.value, [0, 1], [0, BUTTON_WIDTH - 2]);
    return {
      width: extendWidth,
    };
  });
  return (
    <View
      style={[
        styles.buttonPlacement,
        styles.buttonStyle,
        styles.buttonSize,
        isExtending ? styles.buttonShadowDeep : styleHelpers.shadow,
      ]}
    >
      <Pressable onPress={toggleExtendSession} style={{ flex: 1 }}>
        <Animated.View
          style={[
            animStyle,
            styles.buttonSize,
            {
              backgroundColor: "#B4CEFF",
              position: "absolute",
              right: 0,
              height: BUTTON_HEIGHT - 1,
              borderWidth: StyleSheet.hairlineWidth,
            },
          ]}
        />
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: colors.darkest, fontSize: 18, fontWeight: "500" }}>
            {isExtending ? "Extending" : "Extend"}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonPlacement: {
    position: "absolute",
    right: 0,
    top: height / 5,
  },
  buttonStyle: {
    backgroundColor: "white",
    borderWidth: StyleSheet.hairlineWidth,
    width: BUTTON_WIDTH,

    // width: 100,
  },
  buttonSize: {
    height: BUTTON_HEIGHT,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  buttonShadowDeep: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
  buttonShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
export default ExtendAnimation;
