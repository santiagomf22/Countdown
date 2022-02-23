import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import AuthContext from "../components/context/auth/AuthContext";
import { ActivityIndicator } from "react-native-paper";

const AgregarMesa = ({ route, navigation }) => {
  const [departamento, setDepartamento] = useState("0");
  const [municipio, setMunicipio] = useState("0");
  const [listMunicipios, setListMunicipios] = useState([]);
  const [zona, setZona] = useState("0");
  const [listZonas, setListZonas] = useState([]);
  const [puesto, setPuesto] = useState("0");
  const [listPuestos, setListPuestos] = useState([]);
  const [mesa, setMesa] = useState("0");
  const [listMesas, setListMesas] = useState([]);
  const [disabledButton, setDisabledButton] = useState(true);
  const isFocused = useIsFocused();
  const { userName } = useContext(AuthContext);
  const [dataEncabezado, setDataEncabezado] = useState({
    departamento: "",
    departamentoCod: "",
    municipio: "",
    municipioCod: "",
    lugar: "",
    lugarCod: "",
    puesto: "",
    puestoCod: "",
    zona: "",
    zonaCod: "",
    mesa: "",
    mesaCod: "",
  });
  const { id } = route.params;
  const [isLoadingZonas, setIsLoadingZonas] = useState(false);
  const [isLoadingPuestos, setIsLoadingPuestos] = useState(false);
  const [isLoadingMesas, setIsLoadingMesas] = useState(false);

  useEffect(() => {
    setDepartamento("0");
    setMunicipio("0");
    setZona("0");
    setPuesto("0");
    setMesa("0");
    setDisabledButton(true);

    axios
      .post(
        "http://35.231.9.84:8091/scriptcase/app/CountDown/ws_cd/index.php?municipios",
        {
          departamento: "12",
        }
      )
      .then((response) => {
        const municipios = response.data;
        if (municipios) {
          if (municipios.status !== 400) {
            setListMunicipios(municipios["Lista de municipios"]);
          } else {
            console.log("Departamentos no encontradas!");
          }
        } else {
          //loading = true;
          console.log("Departamentos no encontrados!");
        }
      })
      .catch((e) => {
        console.log("error: ", e);
      });
  }, [isFocused]);

  /*  useEffect(() => {
    console.log("departamento- ",departamento)
    console.log("municipio- ",municipio)
    console.log("zona- ",zona)
    console.log("puesto- ",puesto)
    if (departamento !== "0" && (municipio !== "0" || zona !== "0" || puesto !== "0")) {
      setMunicipio("0");
      setZona("0");
      setPuesto("0");
      setMesa("0");
      console.log('entra en departamento')
    }
    if (municipio !== "0") {
      setZona("0");
      setPuesto("0");
      setMesa("0");
    }
    if (zona !== "0") {
      setPuesto("0");
      setMesa("0");
    }
    if (puesto !== "0") {
      setMesa("0");
    }
  }, [departamento, municipio, zona, puesto]); */

  const mesaRegistered = () => {
    const dataMesa = {
      departamento: dataEncabezado.departamento,
      departamentoCod: dataEncabezado.departamentoCod,
      municipio: dataEncabezado.municipio,
      municipioCod: dataEncabezado.municipioCod,
      lugar: dataEncabezado.lugar,
      lugarCod: dataEncabezado.lugarCod,
      puesto: dataEncabezado.puesto,
      puestoCod: dataEncabezado.puestoCod,
      zona: dataEncabezado.zona,
      zonaCod: dataEncabezado.zonaCod,
      mesa: dataEncabezado.mesa,
      mesaCod: dataEncabezado.mesaCod,
    };
    if (id === "camara") {
      navigation.navigate("Camara", { ...dataMesa });
    } else {
      navigation.navigate("Senado", { ...dataMesa });
    }
  };

  const ButtonNext = () => (
    <View style={styles.viewButton}>
      <TouchableOpacity
        onPress={mesaRegistered}
        disabled={disabledButton}
        style={disabledButton ? styles.buttonDisabled : styles.buttonEnabled}
      >
        <View style={styles.containerButton}>
          <Text style={{ fontSize: 16 }}>Continuar</Text>
          <MaterialIcons name="keyboard-tab" color="#008000" size={25} />
        </View>
      </TouchableOpacity>
    </View>
  );

  const onChangeMunicipio = (itemValue) => {
    let separate = itemValue.split("*");
    let cod = separate[0];
    let nom = separate[1];
    setDataEncabezado((prevState) => ({
      ...prevState,
      municipio: nom,
      municipioCod: cod,
    }));
    setMunicipio(itemValue);
    setIsLoadingZonas(true);
    axios
      .post(
        "http://35.231.9.84:8091/scriptcase/app/CountDown/ws_cd/index.php?zonas",
        {
          municipio: cod,
        }
      )
      .then((response) => {
        setIsLoadingZonas(false);

        const zonas = response.data;
        console.log("Veamos zonas ", zonas);
        if (zonas) {
          if (zonas.status !== 400) {
            setListZonas(zonas["Lista de municipios"]);
          } else {
            console.log("Zonas no encontradas!");
            Alert.alert(
              "Error",
              "Lo sentimos en este momento no se pudieron cargar las zonas",
              [{ text: "Entendido" }]
            );
          }
        } else {
          //loading = true;
          console.log("Zonas no encontradas!");
        }
      })
      .catch((e) => {
        console.log("error: ", e);
      });
  };
  const onChangeZona = (itemValue) => {
    setIsLoadingPuestos(true);
    let separate = itemValue.split("*");
    let cod = separate[0];
    let nom = separate[1];
    nom = nom.split(" ");
    nom = nom[1].trim();
    setDataEncabezado((prevState) => ({
      ...prevState,
      zona: nom,
      zonaCod: cod,
    }));
    setZona(itemValue);
    axios
      .post(
        "http://35.231.9.84:8091/scriptcase/app/CountDown/ws_cd/index.php?puestos",
        {
          zona: cod,
        }
      )
      .then((response) => {
        setIsLoadingPuestos(false);

        const puestos = response.data;
        if (puestos) {
          if (puestos.status !== 400) {
            setListPuestos(puestos["Lista de puestos"]);
          } else {
            console.log("Puestos no encontradas!");
          }
        } else {
          //loading = true;
          console.log("Puestos no encontrados!");
        }
      })
      .catch((e) => {
        console.log("error: ", e);
      });
  };
  const onChangePuesto = (itemValue) => {
    setIsLoadingMesas(true);
    let separate = itemValue.split("*");
    let cod = separate[0];
    let nom = separate[1];
    setDataEncabezado((prevState) => ({
      ...prevState,
      puesto: nom,
      puestoCod: cod,
    }));
    setPuesto(itemValue);
    axios
      .post(
        "http://35.231.9.84:8091/scriptcase/app/CountDown/ws_cd/index.php?mesas",
        {
          puesto: cod,
          user: userName,
        }
      )
      .then((response) => {
        setIsLoadingMesas(false);
        const mesas = response.data;
        if (mesas) {
          if (mesas.status !== 400) {
            console.log("Mesas ", mesas);
            setListMesas(mesas["Lista de mesas"]);
          } else {
            console.log("Mesas no encontradas!");
          }
        } else {
          //loading = true;
          console.log("Mesas no encontradas!");
        }
      })
      .catch((e) => {
        console.log("error: ", e);
      });
  };
  const onChangeMesa = (itemValue) => {
    let separate = itemValue.split("*");
    let cod = separate[0];
    let nom = separate[1];
    nom = nom.split(" ");
    nom = nom[1].trim();
    setDataEncabezado((prevState) => ({
      ...prevState,
      mesa: nom,
      mesaCod: cod,
    }));
    setMesa(itemValue);
    if (itemValue !== "0") {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerDatos}>
        <View style={{ flexDirection: "row" }}>
          <Text>Departamento: </Text>
          <Text> Cauca </Text>
          {/* <Picker
            selectedValue={departamento}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setDepartamento(itemValue)}
          >
            <Picker.Item label="Selecciona una opción" value="0" />
            <Picker.Item label="Cauca" value="Cauca" />
            <Picker.Item label="Valle del Cauca" value="Valle del Cauca" />
          </Picker> */}
        </View>
        <View style={styles.rowDatos}>
          <Text>Municipio: </Text>
          <Picker
            selectedValue={municipio}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) =>
              onChangeMunicipio(itemValue)
            }
          >
            <Picker.Item label="Selecciona una opción" value="0" />
            {listMunicipios.map((item) => {
              return (
                <Picker.Item
                  label={item["Municipio"]}
                  value={item["Cod Municipio"] + "*" + item["Municipio"]}
                  key={item["Cod Municipio"]}
                />
              );
            })}
          </Picker>
        </View>
        {isLoadingZonas ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#FC5C06" />
          </View>
        ) : (
          <View style={styles.rowDatos}>
            <Text>Zona: </Text>
            <Picker
              selectedValue={zona}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => onChangeZona(itemValue)}
            >
              <Picker.Item label="Selecciona una opción" value="0" />
              {listZonas.map((item) => {
                return (
                  <Picker.Item
                    label={item["Zona"]}
                    value={item["Cod. Zona"] + "*" + item["Zona"]}
                    key={item["Cod. Zona"]}
                  />
                );
              })}
            </Picker>
          </View>
        )}
        {isLoadingPuestos ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#FC5C06" />
          </View>
        ) : (
          <View style={styles.rowDatos}>
            <Text>Puesto: </Text>
            <Picker
              selectedValue={puesto}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                onChangePuesto(itemValue)
              }
            >
              <Picker.Item label="Selecciona una opción" value="0" />
              {listPuestos.map((item) => {
                return (
                  <Picker.Item
                    label={item["Codigo"] + " - " + item["Puesto"]}
                    value={item["Cod. Puesto"] + "*" + item["Puesto"]}
                    key={item["Cod. Puesto"]}
                  />
                );
              })}
            </Picker>
          </View>
        )}
        {isLoadingMesas ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#FC5C06" />
          </View>
        ) : (
          <View style={styles.rowDatos}>
            <Text>Mesas: </Text>
            <Picker
              selectedValue={mesa}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => onChangeMesa(itemValue)}
            >
              <Picker.Item label="Selecciona una opción" value="0" />
              {listMesas.map((item) => {
                return (
                  <Picker.Item
                    label={item["Mesa"]}
                    value={item["Cod. Mesa"] + "*" + item["Mesa"]}
                    key={item["Cod. Mesa"]}
                  />
                );
              })}
            </Picker>
          </View>
        )}
      </View>

      <View
        style={{
          flex: 1,
          width: "90%",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <ButtonNext />
      </View>
    </View>
  );
};
export default AgregarMesa;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: "center",
  },
  containerDatos: {
    flex: 1,
  },
  rowDatos: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  picker: { height: 50, width: 150 },
  viewButton: {
    flex: 0.3,
    justifyContent: "center",
    width: "100%",
    alignItems: "flex-end",
  },
  containerButton: {
    borderRadius: 75,
    borderWidth: 0.5,
    borderColor: "#2A2A2Aaa",
    flexDirection: "row",
    height: 40,
    justifyContent: "flex-start",
    alignItems: "center",
    marginRight: 20,
    paddingHorizontal: 15,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonEnabled: {
    opacity: 1,
  },
});
