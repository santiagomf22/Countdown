import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Card from "../components/UX/Card";
import { useNavigation } from "@react-navigation/native";

const CamaraSenado = (props) => {
  const navigation = useNavigation();

  const pressCamara = () => {
    navigation.navigate("AgregarMesa",{ id: "camara" });
  };
  const pressSenado = () => {
    navigation.navigate("AgregarMesa",{
        id: "senado"
    });
  };
  return (
    <View style={styles.container}>
      <Card style={styles.button}>
        <TouchableOpacity onPress={pressCamara}>
          <Text style={styles.text}>CAMARA</Text>
        </TouchableOpacity>
      </Card>
      <Card style={styles.button}>
        <TouchableOpacity onPress={pressSenado} /* disabled={true} */>
          <Text style={styles.text}>SENADO</Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

export default CamaraSenado;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "white",
  },
  button: {
    width: "60%",
    height: 50,
    justifyContent: "center",
    backgroundColor: "#FC5C06",
  },
  text: { textAlign: "center", fontSize: 20, fontWeight: "bold" },
});
