import axios from "axios";
import React from "react";
import { Alert } from "react-native";

const sendData = async (
  votos,
  oidPuesto,
  oidMesa,
  login,
  tipoTarjeton,
  checkedRecuento,
  observacion,
  checkedFirmasJurados,
  sufragantes,
  uriImage,
  alerta
) => {
  let recuentoB = 0;
  let firmasB = 0;
  if (checkedRecuento) {
    recuentoB = 1;
  }
  if (checkedFirmasJurados) {
    firmasB = 1;
  }

  let estructuraVotos = votos;
  for (const key in estructuraVotos) {
    const element = estructuraVotos[key];
    for (const value in element) {
      const el = element[value];
      let newValue = 0;
      if (el !== "") {
        newValue = parseInt(el);
      }
      estructuraVotos[key] = { ...estructuraVotos[key], [value]: newValue };
    }
  }

  let jsonCamara = {
    ...estructuraVotos,
    oidPuesto,
    oidMesa,
    login,
    tipoTarjeton,
    recuento: recuentoB,
    observacion,
    soporteInasistencia: firmasB,
    sufragantes,
    alerta,
  };

  let jsonV = JSON.stringify(jsonCamara);
  let statusMesaV = "";
  console.log("Json enviado: ", jsonV);
  console.log("Json estructura: ", estructuraVotos);
  await axios
    .post(
      "http://35.228.188.222/countdown/ws_cd/index.php?registrarResultadoCandidatos",
      //"http://35.231.9.84:8091/scriptcase/app/CountDown/ws_cd/index.php?registrarResultadoCandidatos",
      jsonV
    )
    .then((response) => {
      // Respuesta del servidor
      statusMesaV = response.data.status;
      console.log("Response enviar datos: ", response.data);
      console.log("status: ", statusMesaV);
      if (statusMesaV === 200) {
        Alert.alert("Exitoso!", "La mesa fue verificada correctamente", [
          { text: "Entendido" },
        ]);
      }
      if (statusMesaV === 400) {
        Alert.alert("Error!", "Disculpe las molestias, vuelva a intentarlo", [
          { text: "Entendido" },
        ]);
        return false;
      }
      if (statusMesaV === 405) {
        Alert.alert("Error!", "Esta mesa ya fue registrada", [
          { text: "Entendido" },
        ]);
        return false;
      }
    })
    .catch((e) => {
      console.log(e);
      Alert.alert(
        "Error!",
        "En estos momentos no se puede hacer un registro, intentelo de nuevo!",
        [{ text: "Entendido" }]
      );
      return false;
    });

  if (statusMesaV === 200) {
    if (Array.isArray(uriImage)) {
      uriImage.map(async (item) => {
        const xhr = new XMLHttpRequest();

        const res = await new Promise((resolve, reject) => {
          xhr.onreadystatechange = (e) => {
            if (xhr.readyState !== 4) {
              return false;
            }

            if (xhr.status === 200) {
              // resolve(JSON.parse(xhr.responseText))
              resolve(xhr.responseText);
            } else {
              reject("Request Failed");
            }
          };
          xhr.open(
            "POST",
            "http://35.228.188.222/countdown/ws_cd/index.php?cargarSoporte"
          );
          xhr.setRequestHeader("Content-Type", "multipart/form-data");
          xhr.send(item);
        });
        console.log("respuesta imagen: ", res);
      });
      return false;
    }
  } else {
    console.log(
      "No se pudo cargar el soporte porque la mesa no se cargo exitosamente"
    );
    /* Alert.alert("Error!", "No se pudo cargar el soporte porque la mesa no se cargo exitosamente", [
        { text: "Entendido" },
      ]); */
    return false;
  }

  /* } else {
    console.log(
      "No se pudo cargar el soporte porque la mesa no se cargo exitosamente"
    ); */
  /* Alert.alert("Error!", "No se pudo cargar el soporte porque la mesa no se cargo exitosamente", [
      { text: "Entendido" },
    ]); */
  /* return false;
  } */
};

export default sendData;
