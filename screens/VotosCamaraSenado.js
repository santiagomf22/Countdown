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
  FlatList,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { Card } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import Feather from "react-native-vector-icons/Feather";
import { partidosCamara } from "../components/data/partidos";
import { partidosSenado } from "../components/data/partidosSenado";
import ModalCamera from "../components/ModalCamera";
import AuthContext from "../components/context/auth/AuthContext";
import { ActivityIndicator } from "react-native-paper";
import sendData from "../components/sendData";
import AudioRecorder from "../components/AudioRecorder";
import { useNavigation } from "@react-navigation/native";

const VotosCamaraSenado = (props) => {
  const [totalVotos, setTotalVotos] = useState({});
  const [checkVoto, setCheckVoto] = useState({});
  const [votosMesa, setVotosMesa] = useState(0);
  const [checkedRecuento, setCheckedRecuento] = useState(false);
  const [checkedObservacion, setCheckedObservacion] = useState(false);
  const [checkedFirmasJurados, setCheckedFirmasJurados] = useState(false);
  const [textObservacion, setTextObservacion] = useState("");
  const [soporteCargado, setSoporteCargado] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uriImage, setUriImage] = useState([]);
  const flatlistRef = useRef(null);
  const [totalSufragantes, setTotalSufragantes] = useState();
  const [conteoCorrecto, setConteoCorrecto] = useState(false);
  const {
    estructuraVotos,
    departamento,
    municipio,
    puesto,
    zona,
    mesa,
    puestoCod,
    mesaCod,
    tarjeton,
  } = props;
  const { userName } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showModalAudio, setShowModalAudio] = useState(false);
  const [votos, setVotos] = useState({});
  const navigation = useNavigation();

  //const votos = tarjeton === "1" ? estructuraVotosCandidatosCamara : estructuraVotosCandidatosSenado

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

  /* useEffect(() => {
    if(Object.keys(votos).length !== 0){
      console.log("votos cambia")
      let voto = { ...votos };
      let votosPartido = { ...voto[partidoState] };
      let suma = 0;
      for (const votosCandidato in votosPartido) {
        let voto = 0;
        if (votosPartido[votosCandidato]) {
          voto = parseInt(votosPartido[votosCandidato]);
        }
        suma += voto;
      }
      setTotalVotos({ ...totalVotos, [partidoState]: suma });
      setVotos(voto);
      setCheckVoto({ ...checkVoto, [partidoState + "-" + candidatoState]: true });
    }
  }, [votos]); */

  const cleanData = () => {
    setVotos(estructuraVotos);
    setTotalVotos({});
    setCheckVoto({});
    setVotosMesa(0);
    setTextObservacion("");
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
    flatlistRef.current.scrollToIndex({ animated: true, index: 0 })
    navigation.navigate("Inicio");
  };

  const fecthVotes = (alerta) => {
    let idAlerta = 0;
    if (alerta) {
      idAlerta = 1;
    }
    setIsLoading(true);
    const load = sendData(
      votos,
      puestoCod,
      mesaCod,
      userName,
      tarjeton,
      checkedRecuento,
      textObservacion,
      checkedFirmasJurados,
      totalSufragantes,
      uriImage,
      idAlerta
    );
    setIsLoading(load);
    returnHome();
  };

  const enviarDatos = async () => {
    if (soporteCargado) {
      if (conteoCorrecto) {
        if (
          (checkedObservacion && textObservacion !== "") ||
          !checkedObservacion
        ) {
          fecthVotes(false);
        } else {
          Alert.alert(
            "Error",
            "Si marcaste la casilla observacion debes escribir en el area de texto ",
            [{ text: "Entendido" }]
          );
        }
      } else {
        Alert.alert(
          "Alerta",
          "El total de sufragantes(Formato E-11) y el total de votos en la urna no coinciden ¿Desea continuar con el envio del formato?",
          [
            {
              text: "SI",
              onPress: () => {
                fecthVotes(true);
              },
            },
            {
              text: "NO",
              style: "cancel",
            },
          ]
        );
      }
    } else {
      Alert.alert("Error", "Antes de enviar los datos debe subir el soporte!", [
        { text: "Entendido" },
      ]);
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
    setVotos( (prevstate) => ({ ...prevstate, [partido]: { ...prevstate[partido], [candidato]: text } }))

    setCheckVoto({ ...checkVoto, [partido + "-" + candidato]: true });
  };

  const hideModal = () => {
    setShowModal(false);
  };

  const onPressCargarSoporte = () => {
    setShowModal(true);
  };

  const saveUri = (result) => {
    let localUri = result.uri;
    let filename = localUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    const formData = new FormData();
    formData.append("file", { uri: localUri, name: filename, type });
    formData.append("login", userName);
    formData.append("oidMesa", mesaCod);
    formData.append("oidPuesto", puestoCod);
    formData.append("oidTarjeton", parseInt(tarjeton));
    setUriImage(formData);
    Alert.alert(
      "Correcto",
      "Archivo subido con exito! ¿Deseas subir otra foto?",
      [
        { text: "SI" },
        {
          text: "NO",
          onPress: () => setShowModal(false),
          style: "cancel",
        },
      ]
    );
    setSoporteCargado(true);
  };

  const openModalPanicAudio = () => {
    setShowModalAudio(true);
  };
  const hideModalAudio = () => {
    setShowModalAudio(false);
  };
  if (votos === undefined || Object.entries(votos).length === 0) {
    setVotos(estructuraVotos);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FC5C06" />
      </View>
    );
  }

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
      <AudioRecorder
        visible={showModalAudio}
        onCancel={hideModalAudio}
        oidMesa={mesaCod}
        oidPuesto={puestoCod}
        oidTarjeton={tarjeton}
        login={userName}
      />
      <FlatList
        ref={flatlistRef}
        data={tarjeton === "1" ? partidosCamara : partidosSenado}
        ListHeaderComponent={
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
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <Text>ZONA: {zona} </Text>
                <Text>PUESTO: {puestoCod} </Text>
                <Text>MESA: {mesa}</Text>
              </View>
            </View>
          </Card>
        }
        ListFooterComponent={
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
                <Text style={styles.textoBotonCargar}>Cargar soportes</Text>
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
              <Text style={styles.textVotosMesa}>
                TOTAL DE VOTOS EN LA URNA:
              </Text>
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
        }
        keyExtractor={(item, index) => item.partido}
        renderItem={(itemData) => (
          <Card
            style={{
              marginTop: 10,
              marginHorizontal: 8,
              borderColor: "#202124",
              borderWidth: 0.5,
            }}
          >
            {itemData.item.partido === "NIVELACIÓN DE LA MESA" ? (
              <View style={{ alignItems: "center" }}>
                <Text style={{ paddingTop: 10 }}>{itemData.item.partido}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    paddingBottom: 15,
                    height: 100,
                    alignItems: "flex-end",
                  }}
                >
                  <View style={{ width: "40%", alignItems: "center" }}>
                    <Text style={{ textAlign: "center" }}>
                      {itemData.item.texto1}
                    </Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.inputNivel}
                      value={totalSufragantes}
                      onChangeText={(text) => setTotalSufragantes(text)}
                    />
                  </View>
                  <View style={{ width: "40%", alignItems: "center" }}>
                    <Text style={{ textAlign: "center" }}>
                      {itemData.item.texto2}
                    </Text>
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
                  <Text style={{ textAlign: "center", paddingHorizontal: 40 }}>
                    {itemData.item.partido}
                  </Text>
                  {itemData.item.partido !== "INDIGENA" && (
                    <Image
                      style={{
                        height: 100,
                        width: 300,
                        resizeMode: "contain",
                      }}
                      source={itemData.item.imagen}
                    />
                  )}
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  {itemData.item.candidatos.map((candidato) => (
                    <Card key={candidato} style={styles.card}>
                      <View style={styles.cardContainer}>
                        <Text
                          style={
                            candidato === "Solo partido" ||
                            candidato === "Votos" ||
                            candidato === "Total votos"
                              ? styles.soloPartido
                              : styles.numeros
                          }
                        >
                          {tarjeton === "2" &&
                          (itemData.item.oid === "5" ||
                            itemData.item.oid === "1")
                            ? "Total votos"
                            : candidato}
                        </Text>
                        <TextInput
                          keyboardType="numeric"
                          style={styles.input}
                          placeholder="Ingrese los votos"
                          value={`${votos[itemData.item.oid][candidato]}`}
                          onChangeText={ (text) => handleChange(text,candidato,itemData.item.oid)}
                        />
                        {votos[itemData.item.oid][candidato] !== "" && (
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
                  {(itemData.item.oid === "25" ||
                    itemData.item.oid === "26") && (
                    <Text style={{ textAlign: "center" }}>
                      {itemData.item.info}
                    </Text>
                  )}
                  {((tarjeton === "2" &&
                    parseInt(itemData.item.oid) <= 11 &&
                    parseInt(itemData.item.oid) !== 5 &&
                    parseInt(itemData.item.oid) !== 1) ||
                    (tarjeton === "1" &&
                      parseInt(itemData.item.oid) <= 11)) && (
                    <Card style={styles.card}>
                      <View style={styles.cardContainer}>
                        <Text style={styles.soloPartido}>Total votos</Text>
                        <View style={{ alignItems: "center" }}>
                          <Text style={{ fontSize: 20, paddingLeft: 20 }}>
                            {totalVotos[itemData.item.oid]
                              ? totalVotos[itemData.item.oid]
                              : 0}
                          </Text>
                        </View>
                      </View>
                    </Card>
                  )}
                </View>
              </View>
            )}
          </Card>
        )}
      />
      <TouchableOpacity
        style={styles.alertButton}
        onPress={() => openModalPanicAudio()}
      >
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

export default VotosCamaraSenado;

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
  textoBotonCargar: {
    color: "white",
    fontSize: 15,
  },
  textoBotonEnviar: {
    color: "white",
    fontSize: 18,
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
