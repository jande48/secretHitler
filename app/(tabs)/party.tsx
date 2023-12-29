import { useContext, useState, useEffect } from "react";
import { getStyles } from "../../utils/styles";
import EditScreenInfo from "../../components/EditScreenInfo";
import { Image } from "react-native";
import { Text, View } from "../../components/Themed";
import { UserContext } from "../../utils/userContext";
import { FASCIST, LIBERAL } from "../_layout";
import { capitalizeFirstLetter } from "../../utils/utils";
export default function PartyScreen() {
  const styles: any = getStyles();
  const { playerName, party } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <View style={styles.imageBox}>
        <Image source={party == "liberal" ? LIBERAL : FASCIST} style={styles.imageCenter} />
      </View>
    </View>
  );
}
