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
import { ActivityIndicator, Checkbox } from "react-native-paper";
import { Card } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import Feather from "react-native-vector-icons/Feather";
import { partidos } from "../components/data/partidosSenado";
import { votosCandidatos } from "../components/data/votosCandidatosSenado";
import ModalCamera from "../components/ModalCamera";
import { useIsFocused } from "@react-navigation/native";
import AuthContext from "../components/context/auth/AuthContext";
import sendData from "../components/sendData";

// import Card from "../components/UX/Card"

const Senado = ({ route, navigation }) => {
  const [votos, setVotos] = useState(votosCandidatos);
  const [totalVotos, setTotalVotos] = useState({});
  const [checkVoto, setCheckVoto] = useState({});
  const [votosMesa, setVotosMesa] = useState(0);
  const [checkedRecuento, setCheckedRecuento] = useState(false);
  const [checkedObservacion, setCheckedObservacion] = useState(false);
  const [checkedFirmasJurados, setCheckedFirmasJurados] = useState(false);
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

/*   useEffect(() => {
    setIsLoading(false);
  }, [isFocused]); */

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
    setIsLoading(false);

      cleanData();
    });

    return unsubscribe;
  }, [navigation]);

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
    setAllRight(false);
    setShowModal(false);
    setTotalSufragantes();
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
    /* console.log("Mostrar votos: ", votos)
    let recuentoB = 0;
          let firmasB = 0;
          if (checkedRecuento) {
            recuentoB = 1;
          }
          if (checkedFirmasJurados) {
            firmasB = 1;
          }
    let jsonVo = {
      ...votos,
      oidPuesto: puestoCod,
      oidMesa: mesaCod,
      login: userName,
      tipoTarjeton: "2",
      recuento: recuentoB,
      observacion: textObservacion,
      soporteInasistencia: firmasB,
      sufragantes: totalSufragantes
    };

    let jsonV = JSON.stringify(jsonVo);
    console.log("json muestra: ",jsonV) */
    /* let recuentoB = 0;
          let firmasB = 0;
          if (checkedRecuento) {
            recuentoB = 1;
          }
          if (checkedFirmasJurados) {
            firmasB = 1;
          }
    let jsonVo ={
      ...votos,
                oidPuesto: puestoCod,
                oidMesa: mesaCod,
                login: userName,
                tipoTarjeton: "2",
                recuento: recuentoB,
                observacion: textObservacion,
                soporteInasistencia: firmasB,
                sufragantes: totalSufragantes
    }
    console.log("Json votos ",jsonVo) */
    if (allRight) {
      if (conteoCorrecto) {
        if (
          (checkedObservacion && textObservacion !== "") ||
          !checkedObservacion
        ) {
          setIsLoading(true);

          sendData(votos, puestoCod, mesaCod, userName, "2", checkedRecuento, textObservacion, checkedFirmasJurados, totalSufragantes,uriImage)
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
    /* let allFieldsFilled = true;
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
    } */
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
    formData.append("oidTarjeton", 2);

    setUriImage(formData);
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
              <Text style={styles.label}>¿Hubo recuento de votos?</Text>
              <Checkbox
                status={checkedRecuento ? "checked" : "unchecked"}
                onPress={() => {
                  setCheckedRecuento(!checkedRecuento);
                }}
              />
            </View>
            <View style={styles.checkboxContainer}>
              <Text style={styles.label}>
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

/*  {
  "10": {
    "Votos": "5",
  },
  "11": {
    "Votos": "5",
  },
  "7": {
    "1": "5",
    "10": "5",
    "100": "5",
    "11": "0",
    "12": "0",
    "13": "0",
    "14": "0",
    "15": "0",
    "16": "0",
    "17": "0",
    "18": "0",
    "19": "0",
    "2": "5",
    "20": "2",
    "21": "2",
    "22": "2",
    "23": "2",
    "24": "2",
    "25": "2",
    "26": "2",
    "27": "2",
    "28": "2",
    "29": "2",
    "3": "5",
    "30": "5",
    "31": "5",
    "32": "5",
    "33": "5",
    "34": "5",
    "35": "5",
    "36": "5",
    "37": "5",
    "38": "5",
    "39": "5",
    "4": "5",
    "40": "5",
    "41": "5",
    "42": "5",
    "43": "5",
    "44": "5",
    "45": "5",
    "46": "5",
    "47": "5",
    "48": "5",
    "49": "5",
    "5": "5",
    "50": "8",
    "51": "8",
    "52": "8",
    "53": "8",
    "54": "8",
    "55": "8",
    "56": "8",
    "57": "8",
    "58": "5",
    "59": "5",
    "6": "5",
    "60": "5",
    "61": "5",
    "62": "5",
    "63": "5",
    "64": "5",
    "65": "5",
    "66": "5",
    "67": "5",
    "68": "5",
    "69": "5",
    "7": "5",
    "70": "6",
    "71": "6",
    "72": "6",
    "73": "6",
    "74": "6",
    "75": "6",
    "76": "6",
    "77": "6",
    "78": "6",
    "79": "5",
    "8": "5",
    "80": "5",
    "81": "1",
    "82": "1",
    "83": "1",
    "84": "1",
    "85": "1",
    "86": "1",
    "87": "1",
    "88": "1",
    "89": "1",
    "9": "5",
    "90": "5",
    "91": "5",
    "92": "5",
    "93": "5",
    "94": "5",
    "95": "5",
    "96": "5",
    "97": "5",
    "98": "5",
    "99": "5",
    "Solo partido": "5",
  },
  "8": {
    "Votos": "5",
  },
  "9": {
    "Votos": "5",
  },
  "login": "Santiago",
  "observacion": "",
  "oidMesa": "9",
  "oidPuesto": "174",
  "recuento": 0,
  "soporteInasistencia": 0,
  "sufragantes": 400,
  "tipoTarjeton": "2",
}
 */

/* {
"1":"4",
"2":"5",
"3":"4",
"4":"5",
"5":"7",
"6":"8",
"7":"4",
"8":"8",
"9":"4",
"10":"4",
"11":"7",
"12":"4",
"13":"5",
"14":"4",
"15":"5",
"16":"7",
"17":"1",
"18":"8",
"19":"4",
"20":"7",
"21":"4",
"22":"4",
"23":"4",
"24":"5",
"25":"4",
"26":"2",
"27":"3",
"28":"5",
"29":"4",
"30":"8",
"31":"4",
"32":"2",
"33":"4",
"34":"5",
"35":"7",
"36":"6",
"37":"8",
"38":"2",
"39":"5",
"40":"3",
"41":"4",
"42":"1",
"43":"8",
"44":"7",
"45":"5",
"46":"6",
"47":"0",
"48":"5",
"49":"3",
"50":"2",
"51":"5",
"52":"5",
"53":"4",
"54":"8",
"55":"8",
"56":"6",
"57":"2",
"58":"5",
"59":"8",
"60":"4",
"61":"8",
"62":"6",
"63":"9",
"64":"5",
"65":"8",
"66":"8",
"67":"0",
"68":"4",
"69":"5",
"70":"2",
"71":"5",
"72":"4",
"73":"5",
"74":"8",
"75":"5",
"76":"8",
"77":"1",
"78":"2",
"79":"3",
"80":"5",
"81":"8",
"82":"4",
"83":"5",
"84":"8",
"85":"4",
"86":"2",
"87":"6",
"88":"5",
"89":"5",
"90":"8",
"91":"0",
"92":"4",
"93":"8",
"94":"2",
"95":"3",
"96":"5",
"97":"4",
"98":"4",
"99":"5",
"100":"4",
"Solo partido":"5"
},
"8":{"Votos":"5"},
"9":{"Votos":"12"},
"10":{"Votos":"1"},
"11":{"Votos":"8"},
"oidPuesto":"45",
"oidMesa":"1",
"login":"Santiago",
"tipoTarjeton":"2",
"recuento":0,"observacion":"",
"soporteInasistencia":0,
"sufragantes":"500"
} */
