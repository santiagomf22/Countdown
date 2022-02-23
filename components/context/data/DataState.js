import axios from "axios";
import React, { useMemo, useReducer } from "react";
import DataContext from "./DataContext";
import DataReducer from "./DataReducer";

const AuthState = (props) => {
  const initialData = {
    listaMesas: [],
  };
  const [dataState, dispatch] = useReducer(DataReducer, initialData);
  const dataContext = useMemo(
    () => ({
      pushListaMesas: (listaMesas) => {
        dispatch({
          type: "PUSH_LISTA_ETAPAS",
          listaMesas,
        });
      },
    }),
    []
  );

  return (
    <DataContext.Provider
      value={{
        dataContext,
        listaMesas: dataState.listaMesas,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

export default AuthState;
