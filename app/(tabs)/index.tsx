import { useContext, useState, useEffect } from "react";
import { getStyles } from "../../utils/styles";
import { getBackendRootURL } from "../../utils/utils";
import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import { UserContext } from "../../utils/userContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";

export default function TabOneScreen() {
  const styles: any = getStyles();
  const {
    playerName,
    role,
    party,
    gameCode,
    voteChoice,
    setVoteChoice,
    selectedNumOfPlayers,
    layers,
    jaPlayers,
    setJaPlayers,
    neinPlayers,
    setNeinPlayers,
    setNotVotedPlayers,
    notVotedPlayers,
  } = useContext(UserContext);
  const [votingLoading, setVotingLoading] = useState(false);

  const resetAllVotes = () => {
    setVoteChoice("");
    const resetAllVotes = async () => {
      setVotingLoading(true);
      try {
        const response = await axios.get(
          `${getBackendRootURL()}/secretHitler/reset-votes/${gameCode}/`
        );
        setJaPlayers([]);
        setNeinPlayers([]);
      } catch (err) {
        console.log("the error with resetting voting is ", err);
      } finally {
        setVotingLoading(false);
      }
    };
    resetAllVotes();
  };

  useEffect(() => {
    if (voteChoice) {
      const voteAPICall = async () => {
        try {
          setVotingLoading(true);
          const response = await axios.get(
            `${getBackendRootURL()}/secretHitler/vote/${gameCode}/${playerName.trim()}/${voteChoice}/`
          );
          setJaPlayers(response.data.ja_players);
          setNeinPlayers(response.data.nein_players);
          setNotVotedPlayers(response.data.other_players);
        } catch (err) {
          console.log("the erro with setting a vote is ", err);
        } finally {
          setVotingLoading(false);
        }
      };
      voteAPICall();
    }
  }, [voteChoice]);

  // poll backend

  return (
    <View style={styles.container}>
      <View style={styles.topBox}>
        <Text style={styles.headerLeftText}>{`Code: ${gameCode}`}</Text>
        <Text style={styles.headerLeftText}>{`Name: ${playerName}`}</Text>
      </View>
      <TouchableOpacity
        style={voteChoice == "ja" ? styles.voteJaSelected : styles.voteJa}
        onPress={() => setVoteChoice("ja")}
        disabled={votingLoading}
      >
        <Text
          style={
            voteChoice == "ja"
              ? styles.submitButtonText
              : styles.submitButtonTextJa
          }
        >
          {" "}
          JA (yes){" "}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={voteChoice == "nein" ? styles.voteNeinSelected : styles.voteNein}
        onPress={() => setVoteChoice("nein")}
        disabled={votingLoading}
      >
        <Text
          style={
            voteChoice == "nein"
              ? styles.submitButtonText
              : styles.submitButtonTextNein
          }
        >
          {" "}
          NEIN (no){" "}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 10,
          backgroundColor: "black",
        }}
      >
        <View style={styles.topBox}>
          <Text style={styles.headerCenterText}>JA Votes</Text>
        </View>

        {jaPlayers && jaPlayers.length > 0
          ? jaPlayers.map((player: any) => (
              <Text key={player.name} style={styles.headerLeftTextPadding}>
                {player.name}
              </Text>
            ))
          : ""}
        <View style={styles.topBox}>
          <Text style={styles.headerCenterText}>NEIN Votes</Text>
        </View>
        {neinPlayers && neinPlayers.length > 0
          ? neinPlayers.map((player: any) => (
              <Text key={player.name} style={styles.headerLeftTextPadding}>
                {player.name}
              </Text>
            ))
          : ""}
        <View style={styles.topBox}>
          <Text style={styles.headerCenterText}>Hasn't Voted</Text>
        </View>
        {notVotedPlayers && notVotedPlayers.length > 0
          ? notVotedPlayers.map((player: any) => (
              <Text key={player.name} style={styles.headerLeftTextPadding}>
                {player.name}
              </Text>
            ))
          : ""}
      </View>
      <TouchableOpacity
        style={styles.resetAllVotes}
        onPress={() => resetAllVotes()}
        disabled={votingLoading}
      >
        <Text style={styles.resetText}> Reset All Votes </Text>
      </TouchableOpacity>
    </View>
  );
}
