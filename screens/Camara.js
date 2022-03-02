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
} from "react-native";
import { Checkbox } from "react-native-paper";
import { Card } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import Feather from "react-native-vector-icons/Feather";
import { partidos } from "../components/data/partidos";
import { votosCandidatos } from "../components/data/votosCandidatos";
import ModalCamera from "../components/ModalCamera";
import { useIsFocused } from "@react-navigation/native";
import AuthContext from "../components/context/auth/AuthContext";
import { ActivityIndicator } from "react-native-paper";
import sendData from "../components/sendData";

const Camara = ({ route, navigation }) => {
  const [votos, setVotos] = useState(votosCandidatos);
  const [totalVotos, setTotalVotos] = useState({});
  const [checkVoto, setCheckVoto] = useState({});
  const [votosMesa, setVotosMesa] = useState(0);
  const [checkedRecuento, setCheckedRecuento] = useState(false);
  const [checkedObservacion, setCheckedObservacion] = useState(false);
  const [checkedFirmasJurados, setCheckedFirmasJurados] = useState(false);
  const [textObservacion, setTextObservacion] = useState("");
  const [soporte, setSoporte] = useState("");
  const [soporteCargado, setSoporteCargado] = useState(false);
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
    setIsLoading(false);
    cleanData();
  }, []);


  useEffect(() => {
    let total = 0;
    for (const item in totalVotos) {
      if (item !== "11") {
        total += totalVotos[item];
      }
    }
    if (totalVotos["11"]) {
      total -= totalVotos["11"];
    }
    if (total === parseInt(totalSufragantes)) {
      setConteoCorrecto(true);
    } else {
      setConteoCorrecto(false);
    }
    setVotosMesa(total);
  }, [totalVotos, totalSufragantes]);

  const cleanData = () => {
    setVotos(votosCandidatos);
    setTotalVotos({});
    setCheckVoto({});
    setVotosMesa(0);
    setTextObservacion("");
    setSoporte("");
    setSoporteCargado(false);
    setShowModal(false);
    setTotalSufragantes("");
    setConteoCorrecto(false);
    setCheckedRecuento(false);
    setCheckedObservacion(false);
    setCheckedFirmasJurados(false);
  };
  const returnHome = () => {
    cleanData();
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
    navigation.navigate("Inicio");
  };

  const enviarDatos = async () => {
    if (soporteCargado) {
      if (conteoCorrecto) {
        if (
          (checkedObservacion && textObservacion !== "") ||
          !checkedObservacion
        ) {
          setIsLoading(true);
          sendData(
            votos,
            puestoCod,
            mesaCod,
            userName,
            "1",
            checkedRecuento,
            textObservacion,
            checkedFirmasJurados,
            totalSufragantes,
            uriImage
          );
          setIsLoading(false);
          returnHome();
        } else {
          Alert.alert(
            "Error",
            "Si marcaste la casilla observacion debes escribir en el area de texto ",
            [{ text: "Entendido" }]
          );
        }
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
    setShowModal(true);
  };

  const saveUri = (result) => {
    Alert.alert("Correcto", "Archivo subido con exito!", [
      { text: "Entendido" },
    ]);

    let localUri = result.uri;
    let filename = localUri.split("/").pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append("file", { uri: localUri, name: filename, type });
    formData.append("login", userName);
    formData.append("oidMesa", mesaCod);
    formData.append("oidPuesto", puestoCod);
    formData.append("oidTarjeton", 1);

    setUriImage(formData);
    setSoporteCargado(true);
    setShowModal(false);
    console.log("soporte FormData: ", formData);
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
              <Text>PUESTO: {puestoCod} </Text>
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
                        value={totalSufragantes}
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
                            // value={}
                            onChangeText={(text) =>
                              handleChange(text, candidato, item.oid)
                            }
                          />
                          {votos[item.oid][candidato] !== 0 && (
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
              <Text style={{ textAlign: "center" }}>
                ¿Hubo recuento de votos?
              </Text>
              <Checkbox
                status={checkedRecuento ? "checked" : "unchecked"}
                onPress={() => {
                  setCheckedRecuento(!checkedRecuento);
                }}
              />
            </View>
            <View style={styles.checkboxContainer}>
              <Text style={{ textAlign: "center" }}>
                ¿Si no firmaron todos los jurados hay soporte de inasistencia?
              </Text>
              <Checkbox
                status={checkedFirmasJurados ? "checked" : "unchecked"}
                onPress={() => {
                  setCheckedFirmasJurados(!checkedFirmasJurados);
                }}
              />
            </View>
            <View style={styles.checkboxContainer}>
              <Text style={{ textAlign: "center" }}>
                ¿Tiene alguna observación?
              </Text>
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
      <TouchableOpacity style={styles.alertButton}>
        <Image
          style={{
            height: 50,
            width: 50,
            resizeMode: "cover",
          }}
          tintColor="white"
          source={require("../assets/alert-icon.png")}
        />
      </TouchableOpacity>
    </View>
  ) : (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#FC5C06" />
    </View>
  );
};

export default Camara;

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
    height: 240,
    paddingHorizontal: 20,
  },
  footerObservacion: {
    justifyContent: "center",
    alignItems: "center",
    height: 320,
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
  alertButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    borderRadius: 50,
    backgroundColor: "red",
    width: 60,
    height: 60,
    padding: 10,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});

/* {
  "1": {
    "Solo partido": "5",
  },
  "10": {
    "Votos": "42",
  },
  "11": {
    "Votos": "0",
  },
  "2": {
    "101": "4",
    "102": "4",
    "103": "7",
    "104": "4",
    "Solo partido": "5",
  },
  "3": {
    "101": "4",
    "102": "5",
    "103": "4",
    "104": "7",
    "Solo partido": "1",
  },
  "4": {
    "101": "4",
    "102": "5",
    "103": "4",
    "104": "8",
    "Solo partido": "5",
  },
  "5": {
    "101": "2",
    "102": "5",
    "103": "8",
    "104": "4",
    "Solo partido": "4",
  },
  "6": {
    "101": "5",
    "102": "8",
    "103": "4",
    "104": "7",
    "Solo partido": "2",
  },
  "7": {
    "101": "5",
    "102": "4",
    "103": "8",
    "104": "4",
    "Solo partido": "2",
  },
  "8": {
    "Votos": "5",
  },
  "9": {
    "Votos": "5",
  },
  "login": "Santiago",
  "observacion": "",
  "oidMesa": "7",
  "oidPuesto": "73",
  "recuento": false,
  "soporteInasistencia": false,
  "sufragantes": "200",
  "tipoTarjeton": "1",
}
 */

/* {
  "1":{"Solo partido":"5"},
  "2":{"101":"4","102":"4","103":"7","104":"4","Solo partido":"5"},
  "3":{"101":"4","102":"5","103":"4","104":"7","Solo partido":"1"},
  "4":{"101":"4","102":"5","103":"4","104":"8","Solo partido":"5"},
  "5":{"101":"2","102":"5","103":"8","104":"4","Solo partido":"4"},
  "6":{"101":"5","102":"8","103":"4","104":"7","Solo partido":"2"},
  "7":{"101":"5","102":"4","103":"8","104":"4","Solo partido":"2"},
  "8":{"Votos":"5"},
  "9":{"Votos":"5"},
  "10":{"Votos":"42"},
  "11":{"Votos":"0"},
  "login":"Santiago",
  "observacion":"",
  "oidMesa":"7",
  "oidPuesto":"73",
  "recuento":false,
  "soporteInasistencia":false,
  "sufragantes":"200",
  "tipoTarjeton":"1"
} */
