import { StyleSheet, Dimensions } from "react-native";
import { color } from "style-value-types";
import { colors } from "../../theme";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  field: {
    marginHorizontal: 10,
    marginVertical: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 2,
    marginBottom: 2,
  },
  textInput: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 18,
  },
  errorText: {
    color: colors.alertColor,
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "700",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 10,
    backgroundColor: colors.gray,
  },

  //!! ALERTS
  alertContainer: {
    marginHorizontal: 10,
    borderWidth: 1,
    padding: 5,
  },
  individualAlertContainer: {
    flexDirection: "column",
    padding: 10,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 10,
    backgroundColor: colors.gray,
  },
  alertTitleText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    padding: 5,
    color: colors.white,
  },
  alertTitleView: {
    // backgroundColor: "#CACAAA",
    backgroundColor: colors.dark,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderColor,
    marginHorizontal: 5,
    borderRadius: 15,
    marginVertical: 10,
  },
});
