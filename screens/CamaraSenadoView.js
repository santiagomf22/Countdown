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
import { partidoImages } from "../components/data/partidosImages";
import { votosCandidatos } from "../components/data/votosCandidatos";
import { useIsFocused } from "@react-navigation/native";
import AuthContext from "../components/context/auth/AuthContext";
import axios from "axios";

// import Card from "../components/UX/Card"

const CamaraSenadoView = ({ route, navigation }) => {
  const [votos, setVotos] = useState(votosCandidatos);
  const [totalVotos, setTotalVotos] = useState(0);
  const [checkVoto, setCheckVoto] = useState({});
  const [votosMesa, setVotosMesa] = useState(0);
  const [checkedRecuento, setCheckedRecuento] = useState(false);
  const [checkedObservacion, setCheckedObservacion] = useState(false);
  const [checkedFirmasJurados, setCheckedFirmasJurados] = useState(false);

  const [textObservacion, setTextObservacion] = useState("");
  const [soporte, setSoporte] = useState("");
  const [uriImage, setUriImage] = useState("");
  const isFocused = useIsFocused();
  const [listaDatos, setListaDatos] = useState([]);
  const [totalSufragantes, setTotalSufragantes] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const {
    tarjeton,
    departamento,
    municipio,
    lugar,
    zona,
    puesto,
    mesa,
    oidMesaVotacion,
  } = route.params;
  const { userName } = useContext(AuthContext);

  useEffect(() => {
    console.log("Tarjeton: ",tarjeton)
    console.log("oidmesaVotacion ", oidMesaVotacion);
    setIsLoading(true);
    if(tarjeton )
    axios
      //IP PRUEBA http://35.231.9.84:8091/scriptcase/app/CountDown/ws_cd/index.php?resultadoT
      //IP PRODUCCION http://35.228.188.222/countdown/ws_cd/index.php?resultadoT
      .post(
        "http://35.228.188.222/countdown/ws_cd/index.php?resultadoT",
        {
          oidMesaVotacion: oidMesaVotacion,
          oidTarjeton: tarjeton
        }
      )
      .then((response) => {
        // Respuesta del servidor
        const status = response.data.status;
        console.log("Todo correcto", response.data);
        setIsLoading(false);

        if (status === 200) {
          const listaD = response.data["Lista de datos"];
          // const listaD = response.data["Lista de datos"];
          const observacionR = response.data["observacion"];
          const sufragantesR = response.data["sufragantes"];
          const totalVotosUrnaR = response.data["totalVotosUrnas"];
          const soporteInasistenciaR = response.data["soporteInasistencia"];
          const recuentoR = response.data["recuento"];
          setTextObservacion(observacionR);
          if (observacionR !== "") {
            setCheckedObservacion(true);
          } else {
            setCheckedObservacion(false);
          }
          setTotalSufragantes(sufragantesR);
          setTotalVotos(totalVotosUrnaR);
          let recuentoB = false;
          if (recuentoR === "1") {
            recuentoB = true;
          }
          console.log("Recuento ", recuentoB);

          setCheckedRecuento(recuentoB);
          let juradosB = false;
          if (soporteInasistenciaR === "1") {
            juradosB = true;
          }
          setCheckedFirmasJurados(juradosB);

          listaD.sort((a, b) => {
            return a["Cod Partido"] - b["Cod Partido"];
          });

          setListaDatos(listaD);
        }
        if (status === 400) {
          Alert.alert("Error!", "Disculpe las molestias, vuelva a intentarlo", [
            { text: "Entendido" },
          ]);
          return;
        }
        if (status === 405) {
          Alert.alert("Error!", "Los datos no se registraron correctamente", [
            { text: "Entendido" },
          ]);
          return;
        }
        /* if (status === undefined || !status) {
          returnHome();
        } */
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  }, [isFocused]);

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

  return !isLoading ? (
    <View
      style={{
        flex: 1,
        width: "100%",
        alignItems: "center",
      }}
    >
      <ScrollView>
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
        <View style={{ alignItems: "center" }}>
          <Text style={{ paddingTop: 10 }}>NIVELACIÓN DE LA MESA</Text>
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
                Total sufragantes formato E-11
              </Text>
              <TextInput
                keyboardType="numeric"
                style={styles.inputNivel}
                placeholder={totalSufragantes}
              />
            </View>
            <View style={{ width: "40%", alignItems: "center" }}>
              <Text style={{ textAlign: "center" }}>
                Total votos en la urna
              </Text>
              <TextInput
                keyboardType="numeric"
                style={styles.inputNivel}
                placeholder={totalSufragantes}
              />
            </View>
          </View>
        </View>
        {listaDatos.map((item, index) => {
          return (
            <Card
              key={item.nombrePartidoP}
              style={{
                marginTop: 10,
                marginHorizontal: 8,
                borderColor: "#202124",
                borderWidth: 0.5,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  flex: 1,
                  paddingVertical: 10,
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <Text style={{ textAlign: "center", paddingHorizontal: 40 }}>
                    {item.nombrePartidoP}
                  </Text>
                  <Image
                    style={{
                      height: 100,
                      width: 300,
                      resizeMode: "contain",
                    }}
                    source={partidoImages[item["Cod Partido"]].image}
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

                  <Card style={styles.card}>
                    <View style={styles.cardContainer}>
                      <Text style={styles.soloPartido}>
                        {item.nombrePartidoP !== "VOTOS EN BLANCO" && item.nombrePartidoP !== "VOTOS NO MARCADOS" && item.nombrePartidoP !== "VOTOS NULOS" && item.nombrePartidoP !== "VOTOS INCINERADOS"
                          ? "Solo partido"
                          : "Votos"}
                      </Text>
                      <Text style={{ fontSize: 20, paddingLeft: 15 }}>
                        {item.resultadoPartidoP}
                      </Text>
                    </View>
                  </Card>

                  {item["ListaCandidatos"].map(
                    (key, index) =>
                      key.nombreCandidato !== "" && (
                        <Card
                          key={
                            key.nombreCandidato + "-" + key.resultadoCandidato
                          }
                          style={styles.card}
                        >
                          <View style={styles.cardContainer}>
                            <Text style={styles.numeros}>
                              {key.nombreCandidato}
                            </Text>
                            <Text style={{ fontSize: 20, paddingLeft: 15 }}>
                              {key.resultadoCandidato}
                            </Text>
                          </View>
                        </Card>
                      )
                  )}
                  <Card style={styles.card}>
                    <View style={styles.cardContainer}>
                      <Text style={styles.soloPartido}>Total votos</Text>
                      <View style={{ alignItems: "center" }}>
                        <Text style={{ fontSize: 20, paddingLeft: 20 }}>
                          {item.totalVotos}
                        </Text>
                      </View>
                    </View>
                  </Card>
                </View>
              </View>
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
                disabled={true}
              />
            </View>
            <View style={styles.checkboxContainer}>
              <Text style={{ textAlign: "center" }}>
                ¿Si no firmaron todos los jurados hay soporte de inasistencia?
              </Text>
              <Checkbox
                status={checkedFirmasJurados ? "checked" : "unchecked"}
                disabled={true}
                onPress={() => {
                  setCheckedFirmasJurados(!checkedFirmasJurados);
                }}
              />
            </View>
            <View style={styles.checkboxContainer}>
              <Text style={styles.label}>¿Tiene alguna observación?</Text>
              <Checkbox
                status={checkedObservacion ? "checked" : "unchecked"}
                disabled={true}
              />
            </View>
            {checkedObservacion && (
              <TextInput
                multiline={true}
                numberOfLines={5}
                placeholder={textObservacion}
                style={{
                  borderWidth: 0.5,
                  borderColor: "black",
                  width: 200,
                  maxHeight: 100,
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
              <Text style={styles.textVotosMesa}>{totalVotos}</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  ) : (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#FC5C06" />
    </View>
  );
};

export default CamaraSenadoView;

const styles = StyleSheet.create({
  soloPartido: {
    fontWeight: "bold",
    fontSize: 17,
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
