import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, createContext, useState } from "react";
import { useColorScheme, Text } from "react-native";
import { Provider } from "react-redux";
import CreateOrJoin from "../components/CreateOrJoin";
import { UserContext } from "../utils/userContext";
import { pollBackend } from "../utils/utils";
import axios from "axios";
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

export const FASCIST = require("../assets/images/fascist.png");
export const LIBERAL = require("../assets/images/liberal.png");
export const HITLER = require("../assets/images/hitler.png");
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });
  const colorScheme = useColorScheme();
  const [playerName, setPlayerName] = useState("");
  const [role, setRole] = useState("");
  const [party, setParty] = useState("");
  const [voteChoice, setVoteChoice] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [startedPollBackend, setStartedPollBackend] = useState(false);
  const [stopPollBackend, setStopPollBackend] = useState(false);
  const [jaPlayers, setJaPlayers] = useState([]);
  const [neinPlayers, setNeinPlayers] = useState([]);
  const [notVotedPlayers, setNotVotedPlayers] = useState([]);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (gameCode && playerName && !startedPollBackend) {
      setStopPollBackend(false);
      pollBackend(
        setStartedPollBackend,
        gameCode,
        playerName,
        setVoteChoice,
        setParty,
        setRole,
        setJaPlayers,
        setNeinPlayers,
        axios,
        setNotVotedPlayers,
        false
      );
    }
  }, [gameCode, playerName]);

  if (!loaded) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        playerName,
        setPlayerName,
        gameCode,
        setGameCode,
        role,
        setRole,
        party,
        setParty,
        voteChoice,
        setVoteChoice,
        jaPlayers,
        setJaPlayers,
        neinPlayers,
        setNeinPlayers,
        setNotVotedPlayers,
        notVotedPlayers,
        setStopPollBackend,
        stopPollBackend,
        setStartedPollBackend,
      }}
    >
      <ThemeProvider value={DarkTheme}>
        {!gameCode ? (
          <CreateOrJoin />
        ) : (
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          </Stack>
        )}
      </ThemeProvider>
    </UserContext.Provider>
  );
}
