import { useContext, useState, useEffect } from "react";
import { getStyles } from "../../utils/styles";
import { getBackendRootURL } from "../../utils/utils";
import { Text, View } from "../../components/Themed";
import { UserContext } from "../../utils/userContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";

export default function SettingsScreen() {
  const styles: any = getStyles();
  const {
    playerName,
    gameCode,
    setRole,
    setParty,
    setGameCode,
    setVoteChoice,
    setStartedPollBackend,
    setJaPlayers,
    setNeinPlayers,
    setNotVotedPlayers,
    setStopPollBackend,
  } = useContext(UserContext);
  const [reassignLoading, setReassignLoading] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const resetAllRoles = () => {
    try {
      const resetAPICall = async () => {
        setReassignLoading(true);
        const response = await axios.get(
          `${getBackendRootURL()}/secretHitler/reset-roles/${gameCode}/${playerName}/`
        );
        setRole(response.data.role);
        setParty(response.data.party);
      };
      resetAPICall();
    } catch (err) {
      console.log("the error with the reset api call", err);
    } finally {
      setReassignLoading(false);
    }
  };

  const leaveGame = () => {
    try {
      const makeAPIcall = async () => {
        const response = await axios.delete(
          `${getBackendRootURL()}/secretHitler/game-status/${gameCode}/${playerName.replaceAll(
            " ",
            "_"
          )}/`
        );
      };
      makeAPIcall()
      setStopPollBackend(true);
      setRole("");
      setParty("");
      setGameCode("");
      setVoteChoice("");
      setStartedPollBackend(false);
      setJaPlayers([]);
      setNeinPlayers([]);
      setNotVotedPlayers([]);
    } catch (err) {
      console.log("the error with the leave game api call", err);
    } finally {
      setLeaveLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBox}>
        <Text style={styles.headerLeftText}>{`Code: ${gameCode}`}</Text>
        <Text style={styles.headerLeftText}>{`Name: ${playerName}`}</Text>
      </View>

      <TouchableOpacity
        style={styles.resetAllVotes}
        onPress={() => resetAllRoles()}
        disabled={reassignLoading}
      >
        <Text style={styles.resetText}> Reassign All Roles & Parties </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.leaveGame}
        onPress={() => leaveGame()}
        disabled={leaveLoading}
      >
        <Text style={styles.leaveGameText}> Leave Game </Text>
      </TouchableOpacity>
    </View>
  );
}
