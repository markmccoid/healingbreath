import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Props = {
  errorText: string | undefined;
  showErrorText?: boolean;
};
//!!!!!
//! Incorporate touched options into this
//!!!!!
//!!!!!
const ErrorInputWrapper: React.FC<Props> = ({
  children,
  errorText,
  showErrorText = false,
}) => {
  // const animValues = useSharedValue({ scale: 1, duration: 0, loop: false });
  const scale = useSharedValue(1);
  const progress = useSharedValue(0);

  React.useEffect(() => {
    if (errorText) {
      scale.value = withRepeat(withTiming(1.1, { duration: 1300 }), 0, true);
      progress.value = withRepeat(withTiming(1, { duration: 1300 }), 0, true);
    } else {
      scale.value = withTiming(1, { duration: 500 });
      progress.value = withTiming(0, { duration: 500 });
    }
  }, [errorText]);

  const animatedStyles = useAnimatedStyle(() => {
    const borderColor = interpolateColor(progress.value, [1, 0], ["red", "#ffffff00"]);
    return {
      borderWidth: 1,
      borderRadius: 10,
      borderColor,
      transform: [{ scale: scale.value }],
    };
  });
  return (
    <Animated.View style={animatedStyles}>
      {children}
      {showErrorText && (
        <View style={styles.errorWrapper}>
          <Text style={styles.errorText}>{errorText}</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  errorWrapper: {
    position: "absolute",
    bottom: 2,
    right: 5,
  },
  errorText: {
    fontSize: 10,
    color: "red",
  },
});
export default ErrorInputWrapper;
