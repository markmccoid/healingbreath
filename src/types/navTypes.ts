import { CompositeScreenProps, RouteProp } from "@react-navigation/native";
import { StackScreenProps, StackNavigationProp } from "@react-navigation/stack";

// ------------------------------------
// -- Root Stack Navigator Params List
// ------------------------------------
export type RootStackParamList = {
  SessionList: undefined;
  Session: { name?: string } | undefined;
  "Main Modal": undefined;
};

// -- Root Stack Props
export type RootStackProps<Screen extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, Screen>;
  route: RouteProp<RootStackParamList, Screen>;
};
// ------------------------------------
