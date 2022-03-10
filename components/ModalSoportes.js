import axios from "axios";
import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";

const ModalSoportes = (props) => {
  const windowHeight = Dimensions.get("window").height;
  const newHeight = windowHeight * 0.2;

  const fetchForms = (id) => {
    alertIndex(
      "http://35.228.188.222/countdown/_lib/file/doc/documentosCountd/20220215_cartilla-jurados-votacion_congreso-2022.pdf"
    );
  };

  const alertIndex = (url) => {
    Linking.canOpenURL(url).then(async (supported) => {
      if (supported) {
        try {
          return await Linking.openURL(url);
        } catch {
          return null;
        }
      } else {
        Alert.alert(
          "Error",
          "Lo sentimos no se puede abrir el archivo, inténtelo mas tarde o comuníquese con un administrador",
          [{ text: "Entendido" }]
        );
      }
    });
  };

  return (
    <Modal transparent={true} visible={props.visible} animationType="none">
      <TouchableWithoutFeedback onPress={props.onCancel}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          marginVertical: newHeight,
          marginHorizontal: "10%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          padding: 10,
        }}
      >
        {Array.isArray(props.soportes) ? (
          <ScrollView>
            {props.soportes.map((item) => (
              <TouchableOpacity
                style={styles.btnDownload}
                onPress={() => fetchForms("1")}
              >
                <Text style={styles.textDownload}>
                  Formulario - Error aritmético por anulación de votos
                </Text>
              </TouchableOpacity>
            ))}
            <View style={styles.divider} />
          </ScrollView>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#FC5C06" />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default ModalSoportes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000aa",
  },
  box: {
    backgroundColor: "#ffffff",
    margin: 50,
    borderRadius: 10,
    flex: 1,
  },
  text: {
    fontSize: 20,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    /* borderBottomWidth:0.5,
    borderTopWidth:0.5,
    borderColor: 'black' */
  },
  btnDownload: {
    marginTop: 5,
    marginBottom: 5,
  },
  divider: {
    width: "100%",
    height: 2,
    backgroundColor: "#C0C0C0",
  },
  textDownload: {
    textAlign: "center",
  },
});
