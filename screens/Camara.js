import React from "react";
import VotosCamaraSenado from "./VotosCamaraSenado";
import { estructuraVotosCandidatosCamara } from "../components/data/votosCandidatos";

const Camara = ({ route, navigation }) => {
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
      estructuraVotos = {estructuraVotosCandidatosCamara}
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

export default Camara;
