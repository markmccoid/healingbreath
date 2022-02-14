import React, { useEffect, useState, useReducer, Dispatch } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/core";
import { RootNavProps, RootRouteProps } from "../../types/navTypes";
import { CloseIcon } from "../common/Icons";
import { useStore, StoredSession } from "../../store/useStore";
import { SessionInputProvider, useSessionInputs } from "../../context/SessionInputContext";
import SessionEdit from "./SessionEdit";

const SessionEditMain = () => {
  return (
    <SessionInputProvider>
      <SessionEdit />
    </SessionInputProvider>
  );
};

export default SessionEditMain;
