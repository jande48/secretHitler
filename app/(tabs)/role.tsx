import { useContext, useState, useEffect } from "react";
import { getStyles } from "../../utils/styles";
import { Text, View } from "../../components/Themed";
import { Image } from "react-native";
import { UserContext } from "../../utils/userContext";
import { capitalizeFirstLetter } from "../../utils/utils";
import { FASCIST, LIBERAL, HITLER } from "../_layout";
export default function RoleScreen() {
  const styles: any = getStyles();
  const { playerName, role } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <View style={styles.imageBox}>
        <Image
          source={
            role == "hitler" ? HITLER : role == "liberal" ? LIBERAL : FASCIST
          }
          style={styles.imageCenter}
        />
      </View>
    </View>
  );
}
