import { useNavigation } from "@react-navigation/core";
import { useStore, StoredSession } from "../store/useStore";

const useBreathNavigation = () => {
  const navigation = useNavigation();
  const setActiveSession = useStore((state) => state.setActiveSession);

  //-------------
  // Navigates to a session but first sets the Active Session
  const navigateToSession = (sessionId: string) => {
    setActiveSession(sessionId);
    navigation.navigate("Session");
  };

  return { navigateToSession };
};

export default useBreathNavigation;
