import React, { useContext } from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Image,
  Dimensions,
} from "react-native";
import AuthContext from "../components/context/auth/AuthContext";
import Form from "../components/UX/Form";
import axios from "axios";
import { normalizeFontSize } from "../components/normalizeFontSize";

function Login() {
  const { authContext } = useContext(AuthContext);
  const widthScreen = Dimensions.get("window").width;

  const loginHandle = (userName, password) => {
    axios
      .post("http://35.228.188.222/countdown/ws_cd/index.php?validacionUser", {
        user: userName,
        clave: password,
      })
      .then((response) => {
        // Respuesta del servidor
        const foundUser = response.data.datos_user;
        const status = response.data.status;
        console.log(response.data);
        if (status === 200) {
          authContext.signIn(foundUser);
        }
        if (status === 405) {
          Alert.alert("Error!", "El usuario o la clave son incorrectos", [
            { text: "Entendido" },
          ]);
          return;
        }
      })
      .catch((e) => {
        console.log(e);
      });

    if (userName.length == 0 || password.length == 0) {
      Alert.alert(
        "Entrada errónea!",
        "El usuario o la clave no pueden estar vacíos",
        [{ text: "Entendido" }]
      );
      return;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
      enabled={Platform.OS === "ios" ? true : false}
    >
      <View style={styles.header}>
        <Image
          style={styles.logoHeader}
          source={require("../assets/logo_countdown.png")}
        />
        <Text
          style={{
            color: "#FEF92C",
            fontSize: 0.033 * widthScreen,
            fontWeight: "bold",
            paddingBottom:20
          }}
        >
          ASESORIA PROFESIONAL EN MATERIA ELECTORAL
          {console.log(normalizeFontSize(10))}
        </Text>
      </View>
      <View style={styles.viewForm}>
        <View>
          <Form loginHandle={loginHandle} />
        </View>
      </View>
      <View style={styles.footer}>
        <Image
          style={styles.logoFooter}
          source={require("../assets/manos_levantadas.png")}
        />
      </View>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  header: {
    flex: 0.3,
    width: "100%",
    backgroundColor: "#FC5C06",
    justifyContent: "center",
    alignItems: "center",
  },
  logoHeader: {
    width: "80%",
    height: "40%",
    resizeMode: "center",
    marginTop:20,
  },
  texto_bienvenido: {
    marginTop: "20%",
    fontSize: 24,
    color: "#59352C",
  },
  view_footer_text: {
    flex: 1,
    backgroundColor: "#702E22",
    alignItems: "center",
    justifyContent: "center",
  },
  texto_footer: {
    fontSize: 28,
    color: "white",
    fontFamily: "bodoni-seventytwo",
  },
  view_footer_3logo: {
    flex: 1,
  },
  viewForm: {
    flex: 1,
    width: "85%",
    backgroundColor: "white",
    justifyContent: "center",
  },
  form: {
    position: "absolute",
    width: "85%",
    backgroundColor: "white",
  },
  footer: {
    flex: 0.3,
    width: "100%",
    justifyContent: "center",
  },
  logoFooter: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default Login;
