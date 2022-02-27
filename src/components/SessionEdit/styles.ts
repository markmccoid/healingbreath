import { StyleSheet, Dimensions } from "react-native";

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
    color: "crimson",
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "700",
  },
  alertContainer: {
    marginHorizontal: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: "#777",
    backgroundColor: "#fdd8ed",
    borderRadius: 10,
  },
  individualAlertContainer: {
    flexDirection: "column",
    padding: 10,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "#777",
    borderRadius: 10,
    backgroundColor: "#fbb2db",
  },
  alertTitleText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    padding: 5,
  },
  alertTitleView: {
    backgroundColor: "#CACAAA",
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 5,
    borderRadius: 15,
    marginVertical: 10,
  },
});
