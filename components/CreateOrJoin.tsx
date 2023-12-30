import React, { useState, useContext, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { UserContext } from "../utils/userContext";
import { getBackendRootURL } from "../utils/utils";
import { getNumOfLiberals, getNumOfFacists } from "../utils/utils";
import axios from "axios";
import { TouchableOpacity } from "react-native-gesture-handler";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-toast-message";
import { getStyles } from "../utils/styles";

const CreateOrJoin = (props: any) => {
  const {
    setPlayerName,
    gameCode,
    setGameCode,
    playerName,
    setRole,
    setParty,
    setStopPollBackend,
  } = useContext(UserContext);
  const styles = StyleSheet.create<any>(getStyles());
  const [numOfPlayersOpen, setNumOfPlayersOpen] = useState(false);
  const [itemsNumOfPlayers, setItemsNumOfPlayers] = useState<any>([
    { label: "5 players", value: 5 },
    { label: "6 players", value: 6 },
    { label: "7 players", value: 7 },
    { label: "8 players", value: 8 },
    { label: "9 players", value: 9 },
    { label: "10 players", value: 10 },
  ]);
  const [selectedNumOfPlayers, setSelectedNumOfPlayers] = useState<number>(0);
  const [tempGameCode, setTempGameCode] = useState<string>("");

  const showErrorToast = () => {
    Toast.show({
      type: "error",
      text1: "Whoops!",
      text2: "Couldn't create a game :(",
    });
  };

  const showSuccessToast = () => {
    Toast.show({
      type: "success",
      text1: "Success!",
      text2: "Game Created! 👋",
    });
  };

  const handleCreateGame = () => {
    const createGame = () => {
      try {
        const createGameAsync = async () => {
          const response = await axios.get(
            `${getBackendRootURL()}/secretHitler/create-game/${selectedNumOfPlayers}/${playerName}/`
          );
          setStopPollBackend(false);
          setGameCode(response.data.game_code);
          setRole(response.data.role);
          setParty(response.data.party);
        };
        createGameAsync();
        // redirect to another page
        // setGameCode("1234");
        showSuccessToast();
      } catch (err) {
        showErrorToast();
      }
    };
    createGame();
  };

  const handleJoinGame = () => {
    const joinGame = () => {
      try {
        const joinGameAsync = async () => {
          const response = await axios.get(
            `${getBackendRootURL()}/secretHitler/join-game/${tempGameCode}/${playerName}/`
          );
          setStopPollBackend(false);
          setGameCode(response.data.game_code);
          setRole(response.data.role);
          setParty(response.data.party);
        };
        joinGameAsync();
        // redirect to another page
        // setGameCode("1234");
        showSuccessToast();
      } catch (err) {
        console.log("in the errors");
        showErrorToast();
      }
    };
    joinGame();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBox}>
        <Text style={styles.headerCenterText}>Create or Join a Game</Text>
        <Text style={styles.subheaderLeftText}>Player Name:</Text>
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Ex) Amanda"
          placeholderTextColor="#24527a"
          autoCapitalize="none"
          onChangeText={(text) => setPlayerName(text)}
        />
        <Text style={styles.subheaderLeftText}>Join a Game</Text>
        <View style={styles.middleButton}>
          <TextInput
            style={styles.inputNot100}
            underlineColorAndroid="transparent"
            placeholder="Code"
            placeholderTextColor="#24527a"
            autoCapitalize="none"
            onChangeText={(text) => setTempGameCode(text)}
          />
          <TouchableOpacity
            style={styles.submitButtonJoin}
            // disabled={!gameCode}
            onPress={() => handleJoinGame()}
          >
            <Text style={styles.submitButtonText}>Join</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerCenterText}>----- or -----</Text>
        <Text style={styles.headerLeftText}>Create a Game</Text>
        <Text style={styles.subheaderLeftText}>Number of Players</Text>
        <DropDownPicker
          open={numOfPlayersOpen}
          value={selectedNumOfPlayers}
          items={itemsNumOfPlayers}
          setItems={setItemsNumOfPlayers}
          setOpen={setNumOfPlayersOpen}
          setValue={setSelectedNumOfPlayers}
          style={numOfPlayersOpen ? styles.dropDown : styles.dropDownNoIndex}
          onPress={() => setNumOfPlayersOpen(false)}
          placeholder="Select # of Players"
        />
        {selectedNumOfPlayers && selectedNumOfPlayers > 0 ? (
          <>
            <Text style={styles.headerLeftText}>{`- ${getNumOfLiberals(
              selectedNumOfPlayers
            )} Liberals`}</Text>
            <Text style={styles.headerLeftText}>{`- ${getNumOfFacists(
              selectedNumOfPlayers
            )} Facists`}</Text>
            <Text style={styles.headerLeftText}>- 1 Hitler</Text>
            <TouchableOpacity
              style={styles.submitButtonRecommendations}
              onPress={() => handleCreateGame()}
              disabled={
                !selectedNumOfPlayers ||
                selectedNumOfPlayers == 0 ||
                !playerName
              }
            >
              <Text style={styles.submitButtonText}> Create Game! </Text>
            </TouchableOpacity>
          </>
        ) : (
          ""
        )}
      </View>
    </View>
  );
};
export default CreateOrJoin;
