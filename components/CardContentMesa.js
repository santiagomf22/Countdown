import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { borderColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

const CardContentMesa = (props) => {
  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", textAlign: "center", fontSize: 16 }}>
        Información de la mesa
      </Text>
      <Text style={{ paddingLeft: 10, fontSize: 15, fontWeight: "bold" }}>
        {`->${props.camaraSenado}`}
      </Text>
      <View style={styles.rowText}>
        <Text style={styles.textTitle}> Departamento: </Text>
        <Text>{props.departamento}</Text>
      </View>
      <View style={styles.rowText}>
        <Text style={styles.textTitle}> Municipio: </Text>
        <Text>{props.municipio}</Text>
      </View>
      <View style={styles.rowText}>
        <Text style={styles.textTitle}> Lugar: </Text>
        <Text>{props.lugar}</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={styles.rowText}>
          <Text style={styles.textTitle}> Zona: </Text>
          <Text>{props.zona}</Text>
        </View>
        <View style={styles.rowText}>
          <Text style={styles.textTitle}> Puesto: </Text>
          <Text>{props.puesto}</Text>
        </View>
        <View style={styles.rowText}>
          <Text style={styles.textTitle}> Mesa: </Text>
          <Text>{props.mesa ? props.mesa.split(" ")[1] : ""}</Text>
        </View>
      </View>
    </View>
  );
};

export default CardContentMesa;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingRight: 50,
    backgroundColor: "#FCC15E",
    marginTop:20,
    borderWidth:0.5,
    borderColor: "#2A2A2Aaa",
    borderRadius:5,
    padding: 10
  },
  rowText: {
    flexDirection: "row",
  },
  textTitle: {
    fontWeight: "bold",
  },
});
