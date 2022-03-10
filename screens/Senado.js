import React from "react";
import VotosCamaraSenado from "./VotosCamaraSenado";
import { estructuraVotosCandidatosSenado } from "../components/data/votosCandidatosSenado";

const Senado = ({ route, navigation }) => {
  const {
    departamento,
    municipio,
    puesto,
    zona,
    mesa,
    puestoCod,
    mesaCod,
    tarjeton,
  } = route.params;
  return (
    <VotosCamaraSenado
      estructuraVotos = {estructuraVotosCandidatosSenado}
      departamento={departamento}
      municipio={municipio}
      puesto={puesto}
      zona={zona}
      mesa={mesa}
      puestoCod={puestoCod}
      mesaCod={mesaCod}
      tarjeton={tarjeton}
    />
  );
};

export default Senado;
