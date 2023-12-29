export const getNumOfLiberals = (selectedNumOfPlayers: any) => {
  if ([5].includes(selectedNumOfPlayers)) {
    return 3;
  }
  if ([6, 7].includes(selectedNumOfPlayers)) {
    return 4;
  }
  if ([8, 9].includes(selectedNumOfPlayers)) {
    return 5;
  }
  if ([10].includes(selectedNumOfPlayers)) {
    return 6;
  }
};
export const getNumOfFacists = (selectedNumOfPlayers: any) => {
  if ([5, 6].includes(selectedNumOfPlayers)) {
    return 1;
  }
  if ([8, 7].includes(selectedNumOfPlayers)) {
    return 2;
  }
  if ([10, 9].includes(selectedNumOfPlayers)) {
    return 3;
  }
};

export const getBackendRootURL = () =>
  "https://7338-2600-1700-d50-a2f0-1aa2-799c-343d-4dee.ngrok-free.app";
// "http://172.104.194.142";
// or ngrok
export const pollBackend = (
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
  stopPollBackend
) => {
  if (stopPollBackend) {
    return;
  }
  setStartedPollBackend(true);
  let continuePolling = true;
  try {
    if (!gameCode) {
      return;
    }

    const getGameStatus = async () => {
      const response = await axios.get(
        `${getBackendRootURL()}/secretHitler/game-status/${gameCode}/${playerName.replaceAll(
          " ",
          "_"
        )}/`
      );
      if (!response?.data?.player) {
        setStartedPollBackend(false);
        continuePolling = false;
        stopPollBackend = true;
        setVoteChoice("");
        setParty("");
        setRole("");
        setJaPlayers([]);
        setNeinPlayers([]);
        setNotVotedPlayers([]);
        return;
      }
      setVoteChoice(response.data.player.vote);
      setParty(response.data.player.party);
      setRole(response.data.player.role);
      setJaPlayers(response.data.ja_players);
      setNeinPlayers(response.data.nein_players);
      setNotVotedPlayers(response.data.other_players);
    };
    getGameStatus();
  } catch (err) {
    console.log("the problem with the status is", err);
  }
  if (continuePolling) {
    setTimeout(
      () =>
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
          stopPollBackend
        ),
      3000
    );
  }
};

export const capitalizeFirstLetter = (word: string) => {
  if (!word || word.length < 1) {
    return word;
  }
  const firstLetter = word.charAt(0);
  const firstLetterCap = firstLetter.toUpperCase();
  const remainingLetters = word.slice(1);
  const capitalizedWord = firstLetterCap + remainingLetters;
  return capitalizedWord;
};
