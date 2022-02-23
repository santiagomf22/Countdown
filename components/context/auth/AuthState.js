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
        try {
          userToken = await AsyncStorage.getItem("userToken");
          userName = await AsyncStorage.getItem("userName");
          nombre = await AsyncStorage.getItem("Name");
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "RETRIEVE_TOKEN", token: userToken, userName, nombre });
        /* }, 1000); */
      },

      signIn: async (foundUser) => {
        const user = foundUser.attributes;
        const userToken = String(user.TOKEN);
        const userName = user.userName;
        const userEmail = user.EMAIL;
        const nombre = String(user.NOMBRE);

        try {
          await AsyncStorage.setItem("userToken", userToken);
          await AsyncStorage.setItem("userName", userName);
          await AsyncStorage.setItem("Name", nombre);
        } catch (e) {
          console.log(e);
        }
        dispatch({
          type: "LOGIN",
          id: userName,
          token: userToken,
          email: userEmail,
          nombre: nombre,
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
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
