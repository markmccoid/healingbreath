import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Svg, { Circle, G, Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const MARGIN = 20;
const BACKGROUND_COLOR = "#444B6F";
const BACKGROUND_STROKE_COLOR = "#303858";
const STROKE_COLOR = "#A6E1FA";
const STROKE_WIDTH = 30;

// Main Circle
const MAIN_RADIUS = width / 2 - MARGIN;
const MAIN_DIAMETER = MAIN_RADIUS * 2;
const MAIN_CIRCUMFERENCE = 2 * Math.PI * MAIN_RADIUS;
//const CIRCLE_LENGTH = 1000; // 2PI * R
//const R = CIRCLE_LENGTH / (2 * Math.PI);

const INNER_RADIUS = MAIN_RADIUS / 1.15;
const INNER_DIAMETER = INNER_RADIUS * 2;
const INNER_CIRCUMFERENCE = 2 * Math.PI * INNER_RADIUS; // 2PI * R

function SVGTest() {
  const [step, setStep] = React.useState(0);

  const moveForward = () => {
    setStep((prev) => +(prev + 0.2).toFixed(2));
  };

  const CIRCUMFERENCE = 400;
  const R = CIRCUMFERENCE / (Math.PI * 2);
  return (
    <View
      style={{ flexGrow: 1, justifyContent: "center", alignItems: "center", borderWidth: 2 }}
    >
      <View style={{ position: "absolute" }}>
        <Text>15</Text>
      </View>

      <Svg width={400} height={10} viewBox="0 0 400 10" style={{ borderWidth: 1 }}>
        <Path
          d="M 0 5 H 400"
          fill="red"
          stroke={"blue"}
          strokeWidth={10}
          strokeDasharray={200}
          strokeDashoffset={200 * (1 - step)}
          strokeLinecap="round"
        />
      </Svg>
      <Svg
        width={200}
        height={200}
        viewBox={`0 0 ${230} ${230}`}
        style={{ borderWidth: 1 }}
        // viewBox={`-50 -50 ${200} ${200}`}
        // style={{ borderWidth: 1 }}
        // width={MAIN_DIAMETER}
        // height={MAIN_DIAMETER}
        // viewBox={`0 0 ${MAIN_DIAMETER + STROKE_WIDTH * 2} ${MAIN_DIAMETER + STROKE_WIDTH * 2}`}
        // style={{ borderWidth: 1 }}
      >
        {/* <G rotation="-90" origin={`${100 + 10}, ${100 + 10}`}> */}
        <Circle
          cx={"50%"}
          cy={"50%"}
          fill={"red"}
          r={R}
          stroke={"blue"}
          strokeWidth={15}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - step)}
          rotation="-90"
          origin={`${100 + 15}, ${100 + 15}`}
        />
        {/* </G> */}
      </Svg>
      <TouchableOpacity
        style={{ borderWidth: 1, borderRadius: 5, padding: 5 }}
        onPress={moveForward}
      >
        <Text>Increase</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ borderWidth: 1, borderRadius: 5, padding: 5 }}
        onPress={() => setStep(0)}
      >
        <Text>clear</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 20 }}>{`StepValue=${step}  \nOne minus StepValue=${(
        1 - step
      ).toFixed(2)}`}</Text>
    </View>
  );
}

export default SVGTest;
