export default (prevState, action) => {
  switch (action.type) {
    case "PUSH_LISTA_ETAPAS":
      return {
        ...prevState,
        listaMesas: action.listaMesas,
      };
  }
};
