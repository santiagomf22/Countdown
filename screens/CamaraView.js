import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { Card } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import Feather from "react-native-vector-icons/Feather";
import { partidos } from "../components/data/partidos";
import { votosCandidatos } from "../components/data/votosCandidatos";
import { useIsFocused } from "@react-navigation/native";
import AuthContext from "../components/context/auth/AuthContext";
import axios from "axios";

// import Card from "../components/UX/Card"

const CamaraView = ({ route, navigation }) => {
  const [votos, setVotos] = useState(votosCandidatos);
  const [totalVotos, setTotalVotos] = useState({});
  const [checkVoto, setCheckVoto] = useState({});
  const [votosMesa, setVotosMesa] = useState(0);
  const [checkedRecuento, setCheckedRecuento] = useState(false);
  const [checkedObservacion, setCheckedObservacion] = useState(false);
  const [textObservacion, setTextObservacion] = useState("");
  const [soporte, setSoporte] = useState("");
  const [uriImage, setUriImage] = useState("");
  const isFocused = useIsFocused();
  const scrollRef = useRef();
  const [totalSufragantes, setTotalSufragantes] = useState();
  const { departamento, municipio, puesto, zona, mesa, puestoCod, mesaCod, lugar } =
    route.params;
  const { userName } = useContext(AuthContext);

  /* useEffect(() => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }, [isFocused]); */

  const cleanData = () => {
    setTotalVotos({});
    setCheckVoto({});
    setVotosMesa(0);
    setTextObservacion("");
    setSoporte("");
    setAllRight(false);
    setShowModal(false);
    setShowCamera(false);
    setTotalSufragantes();
    setConteoCorrecto(false);
  };

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        alignItems: "center",
      }}
    >
      <ScrollView ref={scrollRef}>
        <Card>
          <View style={{ padding: 10 }}>
            <View style={styles.rowHeader}>
              <Text style={styles.textHeader}>DEPARTAMENTO: </Text>
              <Text style={styles.textHeader}>CAUCA</Text>
            </View>
            <View style={styles.rowHeader}>
              <Text style={styles.textHeader}>MUNICIPIO: </Text>
              <Text style={styles.textHeader}>{municipio}</Text>
            </View>
            <View style={styles.rowHeader}>
              <Text style={styles.textHeader}>LUGAR: </Text>
              <Text style={styles.textHeader}>{lugar}</Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <Text>ZONA: {zona} </Text>
              <Text>PUESTO: {puesto} </Text>
              <Text>MESA: {mesa}</Text>
            </View>
          </View>
        </Card>
        {partidos.map((item) => {
          return (
            <Card
              key={item.partido}
              style={{
                marginTop: 10,
                marginHorizontal: 8,
                borderColor: "#202124",
                borderWidth: 0.5,
              }}
            >
              {item.partido === "NIVELACIÓN DE LA MESA" ? (
                <View style={{ alignItems: "center" }}>
                  <Text style={{ paddingTop: 10 }}>{item.partido}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingBottom: 15,
                      height: 100,
                      alignItems: "flex-end",
                    }}
                  >
                    <View style={{ width: "40%", alignItems: "center" }}>
                      <Text style={{ textAlign: "center" }}>{item.texto1}</Text>
                      <TextInput
                        keyboardType="numeric"
                        style={styles.inputNivel}
                      />
                    </View>
                    <View style={{ width: "40%", alignItems: "center" }}>
                      <Text style={{ textAlign: "center" }}>{item.texto2}</Text>
                      <TextInput
                        keyboardType="numeric"
                        style={styles.inputNivel}
                      />
                    </View>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "column",
                    flex: 1,
                    paddingVertical: 10,
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{ textAlign: "center", paddingHorizontal: 40 }}
                    >
                      {item.partido}
                    </Text>
                    <Image
                      style={{
                        height: 100,
                        width: 300,
                        resizeMode: "contain",
                      }}
                      source={item.imagen}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    {item.candidatos.map((candidato) => (
                      <Card key={candidato} style={styles.card}>
                        <View style={styles.cardContainer}>
                          <Text
                            style={
                              candidato === "Solo partido" ||
                              candidato === "Votos"
                                ? styles.soloPartido
                                : styles.numeros
                            }
                          >
                            {candidato}
                          </Text>
                          <Text style={{fontSize:20, paddingLeft: 15}}>50</Text>
                        </View>
                      </Card>
                    ))}
                    <Card style={styles.card}>
                      <View style={styles.cardContainer}>
                        <Text style={styles.soloPartido}>Total votos</Text>
                        <View style={{ alignItems: "center" }}>
                          <Text style={{ fontSize: 20, paddingLeft: 20 }}>
                            {totalVotos[item.oid] ? totalVotos[item.oid] : 0}
                          </Text>
                        </View>
                      </View>
                    </Card>
                  </View>
                </View>
              )}
            </Card>
          );
        })}
        <Card style={{ marginTop: 15 }}>
          <View
            style={
              !checkedObservacion ? styles.footer : styles.footerObservacion
            }
          >
            <View style={styles.checkboxContainer}>
              <Text style={styles.label}>¿Hubo recuento de votos?</Text>
              <Checkbox
                status={checkedRecuento ? "checked" : "unchecked"}
              />
            </View>
            <View style={styles.checkboxContainer}>
              <Text style={styles.label}>¿Tiene alguna observación?</Text>
              <Checkbox
                status={checkedObservacion ? "checked" : "unchecked"}
              />
            </View>
            {checkedObservacion && (
              <TextInput
                multiline={true}
                numberOfLines={5}
                style={{
                  borderWidth: 0.5,
                  borderColor: "black",
                  width: 200,
                  paddingBottom: 10,
                  paddingHorizontal: 10,
                }}
              />
            )}
            <Text style={styles.textVotosMesa}>TOTAL DE VOTOS EN LA URNA:</Text>
            <View
              style={{
                flexDirection: "row",
                width: 50,
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.textVotosMesa}>{votosMesa}</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

export default CamaraView;

const styles = StyleSheet.create({
  soloPartido: {
    fontWeight: "bold",
    fontSize: 18,
  },
  numeros: {
    fontWeight: "bold",
    fontSize: 25,
  },
  input: {
    marginLeft: 5,
    borderBottomWidth: 1,
    borderColor: "black",
    textAlign: "center",
  },
  inputNivel: {
    borderBottomWidth: 1,
    borderColor: "black",
    textAlign: "center",
    width: "80%",
  },
  textHeader: {
    paddingBottom: 5,
  },
  textVotosMesa: {
    fontSize: 18,
    textAlign: "center",
    width: "100%",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "center",
  },
  checkbox: {
    alignSelf: "center",
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    paddingHorizontal: 20,
  },
  footerObservacion: {
    justifyContent: "center",
    alignItems: "center",
    height: 280,
    paddingHorizontal: 20,
  },
  botonEnviar: {
    backgroundColor: "#007aff",
    paddingHorizontal: 30,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  botonCargarSoporte: {
    backgroundColor: "#007aff",
    paddingHorizontal: 30,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 30,
  },
  textoBotonEnviar: {
    color: "white",
    fontSize: 18,
  },
  textoBotonCargar: {
    color: "white",
    fontSize: 15,
  },
  card: {
    flex: 1,
    width: "80%",
    height: 50,
    margin: 2,
    borderColor: "black",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  rowHeader: {
    flexDirection: "row",
  },
});
