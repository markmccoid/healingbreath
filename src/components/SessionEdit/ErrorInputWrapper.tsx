import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export type Props = {
  errorText: string | undefined;
  showErrorText?: boolean;
  // If you send, it must be a boolean.  Formik sends undefined, so
  // you need to change it to boolens touched.field ?? false
  isTouched?: boolean;
};

const ErrorInputWrapper: React.FC<Props> = ({
  children,
  errorText,
  showErrorText = false,
  isTouched = true,
}) => {
  // const animValues = useSharedValue({ scale: 1, duration: 0, loop: false });
  const scale = useSharedValue(1);
  const progress = useSharedValue(0);
  // Need this ref to let us know if we are already in an animation.
  // don't want to restart if already animating
  const isAnimating = React.useRef(false);

  React.useEffect(() => {
    if (errorText && isTouched) {
      if (!isAnimating.current) {
        isAnimating.current = true;
        scale.value = withRepeat(withTiming(1.1, { duration: 1300 }), 0, true);
        progress.value = withRepeat(withTiming(1, { duration: 1300 }), 0, true);
      }
    } else {
      isAnimating.current = false;
      scale.value = withTiming(1, { duration: 500 });
      progress.value = withTiming(0, { duration: 500 });
    }
  }, [errorText, isTouched]);

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
      {showErrorText && isTouched && (
        <View style={styles.errorWrapper}>
          <Text style={styles.errorText}>{errorText || ""}</Text>
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
