import React from "react";
import { Button, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  useAnimatedProps,
} from "react-native-reanimated";

function Box() {
  const offset = useSharedValue(1);
  const [state, setState] = React.useState("in");
  const [breath, setBreath] = React.useState(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: offset.value,
      transform: [{ scale: 1 }],
    };
  });

  React.useEffect(() => {
    offset.value = withTiming(breath, { duration: 1600 });
  }, [breath]);

  return (
    <>
      <Animated.View style={[styles.box, animatedStyles]} />
      <Button
        onPress={() => {
          // offset.value = withTiming(breath, { duration: 1600 });
          setBreath(0);
        }}
        title="out"
      />
      <Button
        onPress={() => {
          // offset.value = withTiming(breath, { duration: 1600 });
          setBreath(200);
        }}
        title="in"
      />
    </>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: "purple",
  },
});
export default Box;
