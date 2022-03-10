import React, { useMemo, useReducer } from "react";
import AuthContext from "./AuthContext";
import AuthReducer from "./AuthReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthState = (props) => {
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
    userEmail: null,
    nombre: null,
    rol: null
  };
  const [loginState, dispatch] = useReducer(AuthReducer, initialLoginState);
  const authContext = useMemo(
    () => ({
      getToken: async () => {
        /* setTimeout(async () => { */
        //setIsLoading(false);
        let userToken;
        userToken = null;
        let userName = null;
        let nombre = null;
        let rol = null;
        try {
          userToken = await AsyncStorage.getItem("userToken");
          userName = await AsyncStorage.getItem("userName");
          nombre = await AsyncStorage.getItem("Name");
          rol = await AsyncStorage.getItem("Rol");
          // console.log("Rol authstate: ",rol)
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "RETRIEVE_TOKEN", token: userToken, userName, nombre, rol });
        /* }, 1000); */
      },

      signIn: async (foundUser) => {
        const user = foundUser.attributes;
        const userToken = String(user.TOKEN);
        const userName = user.userName;
        const userEmail = user.EMAIL;
        const nombre = String(user.NOMBRE);
        const rol = user.GRUPOS;

        try {
          await AsyncStorage.setItem("userToken", userToken);
          await AsyncStorage.setItem("userName", userName);
          await AsyncStorage.setItem("Name", nombre);
          await AsyncStorage.setItem("Rol", rol);
        } catch (e) {
          console.log(e);
        }
        dispatch({
          type: "LOGIN",
          id: userName,
          token: userToken,
          email: userEmail,
          nombre: nombre,
          rol: rol
        });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem("userToken");
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGOUT" });
      },
      signUp: () => {
        // setUserToken('fgkj');
        // setIsLoading(false);
      },
    }),
    []
  );

  return (
    <AuthContext.Provider
      value={{
        authContext,
        isLoading: loginState.isLoading,
        userToken: loginState.userToken,
        userName: loginState.userName,
        userEmail: loginState.userEmail,
        nombre: loginState.nombre,
        rol: loginState.rol,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
