import axios from "axios";
import React from "react";
import { Alert } from "react-native";

const sendData = async(
  votos,
  oidPuesto,
  oidMesa,
  login,
  tipoTarjeton,
  checkedRecuento,
  observacion,
  checkedFirmasJurados,
  sufragantes,
  uriImage
) => {

  let recuentoB = 0;
  let firmasB = 0;
  if (checkedRecuento) {
    recuentoB = 1;
  }
  if (checkedFirmasJurados) {
    firmasB = 1;
  }
  let jsonCamara = {
    ...votos,
    oidPuesto,
    oidMesa,
    login,
    tipoTarjeton,
    recuento: recuentoB,
    observacion,
    soporteInasistencia: firmasB,
    sufragantes
  };

  let jsonV = JSON.stringify(jsonCamara);
  console.log("json enviado: ", jsonV);
  let statusMesaV = "";
  await axios
    .post(
      "http://35.228.188.222/countdown/ws_cd/index.php?registrarResultadoCandidatos",
      jsonV
    )
    .then((response) => {
      // Respuesta del servidor
      statusMesaV = response.data.status;
      console.log("Response enviar datos: ", response.data);
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
      return false;
    });

  if (statusMesaV === 200) {
      console.log("Entro a cargar soporte")
      console.log("Image ", uriImage)
    const xhr = new XMLHttpRequest();

    const res = await new Promise((resolve, reject) => {
      xhr.onreadystatechange = (e) => {
        if (xhr.readyState !== 4) {
          return;
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
      xhr.send(uriImage);
    });
console.log("respuesta imagen: ",res)
    return false;

  } else {
    console.log(
      "No se pudo cargar el soporte porque la mesa no se cargo exitosamente"
    );
    return false;

  }
};

export default sendData;
