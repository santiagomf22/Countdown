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
import { partidos } from "../components/data/partidosSenado";
import { votosCandidatos } from "../components/data/votosCandidatosSenado";
import ModalCamera from "../components/ModalCamera";
import { useIsFocused } from "@react-navigation/native";
import AuthContext from "../components/context/auth/AuthContext";
import axios from "axios";

// import Card from "../components/UX/Card"

const Senado = ({ route, navigation }) => {
  const [votos, setVotos] = useState(votosCandidatos);
  const [totalVotos, setTotalVotos] = useState({});
  const [checkVoto, setCheckVoto] = useState({});
  const [votosMesa, setVotosMesa] = useState(0);
  const [checkedRecuento, setCheckedRecuento] = useState(false);
  const [checkedObservacion, setCheckedObservacion] = useState(false);
  const [textObservacion, setTextObservacion] = useState("");
  const [soporte, setSoporte] = useState("");
  const [allRight, setAllRight] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uriImage, setUriImage] = useState("");
  const isFocused = useIsFocused();
  const scrollRef = useRef();
  const [totalSufragantes, setTotalSufragantes] = useState();
  const [conteoCorrecto, setConteoCorrecto] = useState(false);
  const { departamento, municipio, puesto, zona, mesa, puestoCod, mesaCod } =
    route.params;
  const { userName } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      cleanData();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    let total = 0;
    for (const item in totalVotos) {
      total += totalVotos[item];
    }
    if (total === parseInt(totalSufragantes)) {
      setConteoCorrecto(true);
    } else {
      setConteoCorrecto(false);
    }
    setVotosMesa(total);
  }, [totalVotos, totalSufragantes]);

  const cleanData = () => {
    setTotalVotos({});
    setCheckVoto({});
    setVotosMesa(0);
    setTextObservacion("");
    setSoporte("");
    setAllRight(false);
    setShowModal(false);
    setTotalSufragantes();
    setConteoCorrecto(false);
  };

  const enviarDatos = () => {
    if (allRight) {
      if (conteoCorrecto) {
        setIsLoading(true);
        axios
          .post(
            "http://35.231.9.84:8091/scriptcase/app/CountDown/ws_cd/index.php?registrarResultadoCandidatos",
            {
              ...votos,
              oidPuesto: puestoCod,
              oidMesa: mesaCod,
              login: userName,
              tipoTarjeton: "2",
            }
          )
          .then((response) => {
            // Respuesta del servidor
            setIsLoading(false);
            const status = response.data.status;
            if (status === 200) {
              cleanData();
              scrollRef.current?.scrollTo({
                y: 0,
                animated: true,
              });
              navigation.navigate("Inicio");
              Alert.alert("Exitoso!", "La mesa fue verificada correctamente", [
                { text: "Entendido" },
              ]);
            }
            if (status === 400) {
              Alert.alert(
                "Error!",
                "Disculpe las molestias, vuelva a intentarlo",
                [{ text: "Entendido" }]
              );
              return;
            }
            if (status === 405) {
              Alert.alert("Error!", "Esta mesa ya fue registrada", [
                { text: "Entendido" },
              ]);
              return;
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        Alert.alert(
          "Error",
          "No se pueden subir los datos porque los votos no concuerdan",
          [{ text: "Entendido" }]
        );
      }
    } else {
      Alert.alert(
        "Error",
        "Antes de enviar los datos debe llenar todos los campos y subir el soporte!",
        [{ text: "Entendido" }]
      );
    }
  };

  const handleChange = (text, candidato, partido) => {
    let voto = { ...votos };
    voto[partido] = { ...voto[partido], [candidato]: text };
    let votosPartido = { ...voto[partido] };
    let suma = 0;
    for (const votosCandidato in votosPartido) {
      let voto = 0;
      if (votosPartido[votosCandidato]) {
        voto = parseInt(votosPartido[votosCandidato]);
      }
      suma += voto;
    }
    setTotalVotos({ ...totalVotos, [partido]: suma });
    setVotos(voto);
    setCheckVoto({ ...checkVoto, [partido + "-" + candidato]: true });
  };

  const hideModal = () => {
    setShowModal(false);
  };

  const onPressCargarSoporte = () => {
    let allFieldsFilled = true;
    for (const key in votos) {
      const partido = votos[key];
      for (const candidato in partido) {
        const element = partido[candidato];
        if (element === "") {
          allFieldsFilled = false;
        }
      }
    }
    if (allFieldsFilled) {
      setShowModal(true);
    } else {
      Alert.alert(
        "Error",
        "Antes de cargar el soporte debe llenar todos los campos!",
        [{ text: "Entendido" }]
      );
    }
  };

  const saveUri = (uri) => {
    Alert.alert("Correcto", "Imagen subida con exito!", [
      { text: "Entendido" },
    ]);
    setUriImage(uri);
    setAllRight(true);
    setShowModal(false);
  };

  return !isLoading ? (
    <View
      style={{
        flex: 1,
        width: "100%",
        alignItems: "center",
      }}
    >
      <ModalCamera
        visible={showModal}
        onCancel={hideModal}
        uriImage={saveUri}
      />
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
              <Text style={styles.textHeader}>{puesto}</Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <Text>ZONA: {zona} </Text>
              <Text>PUESTO: 00 </Text>
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
                        onChangeText={(text) => setTotalSufragantes(text)}
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
                          <TextInput
                            keyboardType="numeric"
                            style={styles.input}
                            placeholder="Ingrese los votos"
                            onChangeText={(text) =>
                              handleChange(text, candidato, item.oid)
                            }
                          />
                          {votos[item.oid][candidato] !== "" && (
                            <Animatable.View animation="bounceIn">
                              <Feather
                                name="check-circle"
                                color="green"
                                size={20}
                              />
                            </Animatable.View>
                          )}
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
            <TouchableOpacity
              style={styles.botonCargarSoporte}
              // onPress={()=>pickDocument(votos)}
              onPress={() => onPressCargarSoporte()}
            >
              <Text style={styles.textoBotonCargar}>Cargar soporte</Text>
            </TouchableOpacity>
            <View style={styles.checkboxContainer}>
              <Text style={styles.label}>¿Hubo recuento de votos?</Text>
              <Checkbox
                status={checkedRecuento ? "checked" : "unchecked"}
                onPress={() => {
                  setCheckedRecuento(!checkedRecuento);
                }}
              />
            </View>
            <View style={styles.checkboxContainer}>
              <Text style={styles.label}>¿Tiene alguna observación?</Text>
              <Checkbox
                status={checkedObservacion ? "checked" : "unchecked"}
                onPress={() => {
                  setCheckedObservacion(!checkedObservacion);
                }}
              />
            </View>
            {checkedObservacion && (
              <TextInput
                multiline={true}
                numberOfLines={5}
                onChangeText={(text) => setTextObservacion(text)}
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
              {conteoCorrecto && (
                <Animatable.View animation="bounceIn">
                  <Feather name="check-circle" color="green" size={25} />
                </Animatable.View>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.botonEnviar} onPress={enviarDatos}>
            <Text style={styles.textoBotonEnviar}>ENVIAR</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  ) : (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#FC5C06" />
    </View>
  );
};

export default Senado;

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
