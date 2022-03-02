import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Card from "../components/UX/Card";
import { ActivityIndicator } from "react-native-paper";
import CardContentMesa from "../components/CardContentMesa";
import AuthContext from "../components/context/auth/AuthContext";
import axios from "axios";

const ListaMesas = (props) => {
  const { userName } = useContext(AuthContext);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [data, setData] = useState(mesas);
  const [nombreMesa, setNombreMesa] = useState("");
  const [nombreZona, setNombreZona] = useState("");
  const [nombrePuesto, setNombrePuesto] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [tipoTarjeton, setTipoTarjeton] = useState("");
  const [oidTarjeton, setOidTarjeton] = useState("");
  const mesas = [
    {
      Tarjeton: "",
      departamento: "",
      municipio: "",
      NombrePuestos: "",
      nombreZonas: "",
      CodigoPuestos: "",
      NombreMesas: "",
    },
  ];
  useEffect(() => {
    axios
      .post(
        "http://35.228.188.222/countdown/ws_cd/index.php?mesasverificadas",
        {
          user: userName,
        }
      )
      .then((response) => {
        // Respuesta del servidor
        const status = response.data.status;
        const mesas = [];
        if (status === 200) {
          const mesasVerificadas = response.data["Detalles Mesas"];
          /*        const nombreMesa = mesasVerificadas.nombreMesa;
          const nombreZona = mesasVerificadas.nombreZona;
          const nombrePuesto = mesasVerificadas.nombrePuesto;
          const municipio = mesasVerificadas.municipio;
          const departamento = mesasVerificadas.departamento;
          const tipoTarjeton = mesasVerificadas.tipoTarjeton;
*/
          /* 
          mesas.push(mesasVerificadas.nombreMesa);
          mesas.push(mesasVerificadas.nombreZona);
          mesas.push(mesasVerificadas.nombrePuesto);
          mesas.push(mesasVerificadas.municipio);
          mesas.push(mesasVerificadas.departamento);
          mesas.push(mesasVerificadas.tipoTarjeton); 
*/
          let oidTarjeton = "";
          if (mesasVerificadas.tipoTarjeton === "Cámara") {
            oidTarjeton = 1;
          } else {
            oidTarjeton = 2;
          }
          setData(mesasVerificadas);
        }
        if (status === 400) {
          return;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [isFocused]);

  const onAddMesa = () => {
    navigation.navigate("CamaraSenado");
  };

  const onPressMesa = (info) => {
    
    const dataMesa = {
      tarjeton: info.Tarjeton,
      departamento: info.departamento,
      municipio: info.municipio,
      lugar: info.NombrePuestos,
      zona: info.nombreZonas,
      puesto: info.CodigoPuestos,
      mesa: info.NombreMesas,
      oidMesaVotacion: info.oidMesaVotacion
    };
    if (info.Tarjeton === "Senado") {
      navigation.navigate("CamaraSenadoView", { ...dataMesa,  tarjeton: "2" });
    } else {
      navigation.navigate("CamaraSenadoView", { ...dataMesa,  tarjeton: "1" });
    }
    /* const dataMesa = {
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
    }; */
  };

  const ButtonAdd = () => (
    <View style={styles.viewButton}>
      <TouchableOpacity onPress={onAddMesa}>
        <View style={styles.containerButton}>
          <Text style={{ fontSize: 16 }}>Agregar</Text>
          <MaterialIcons name="add" color="#008000" size={20} />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#633127" />
        </View>
      ) : status !== 200 ? (
        <View style={styles.container}>
          <ButtonAdd />
          <Text style={{ fontWeight: "bold", fontSize: 17 }}>
            MESAS REGISTRADAS
          </Text>
          <View style={styles.viewStages}>
            <FlatList
              data={data}
              keyExtractor={(item, index) =>
                item.NombreMesas +
                "-" +
                item.CodigoPuestos +
                "-" +
                item.Tarjeton
                + "-" +
                Math.random()
              }
              renderItem={(itemData) => (
                <TouchableOpacity
                  onPress={() => onPressMesa(itemData.item)}
                >
                  <CardContentMesa
                    camaraSenado={itemData.item.Tarjeton}
                    departamento={itemData.item.departamento}
                    municipio={itemData.item.municipio}
                    lugar={itemData.item.NombrePuestos}
                    zona={itemData.item.nombreZonas}
                    puesto={itemData.item.CodigoPuestos}
                    mesa={itemData.item.NombreMesas}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      ) : (
        <>
          <ButtonAdd />
          <View style={styles.containerError}>
            <Text style={styles.message}>No tiene mesas registradas!</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default ListaMesas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerError: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100,
  },
  message: {
    fontSize: 15,
    fontWeight: "bold",
  },
  viewStages: {
    flex: 3,
    width: "90%",
  },
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
    width: "40%",
    height: 30,
    justifyContent: "flex-start",
    alignItems: "center",
    marginRight: 20,
    paddingHorizontal: 5,
  },
});
