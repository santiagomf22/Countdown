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
} from "react-native";

function ModalDownload(props) {
  const windowHeight = Dimensions.get("window").height;
  const newHeight = windowHeight * 0.2;
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
        <ScrollView>
          <TouchableOpacity style={styles.btnDownload}>
            <Text style={styles.textDownload}>
              Formulario - Error aritmético por anulación de votos
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload}>
            <Text style={styles.textDownload}>
              Formulario - Error aritmético aumento votación otros partidos
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload}>
            <Text style={styles.textDownload}>
              Formulario - Tachaduras y enmendaduras
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload}>
            <Text style={styles.textDownload}>
              Formulario - Extemporaneidad
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload}>
            <Text style={styles.textDownload}>Formulario - Diferencia 10%</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload}>
            <Text style={styles.textDownload}>
              Formulario - Falta de firmas de los jurados
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload}>
            <Text style={styles.textDownload}>
              Formulario - Votos destruidos o perdidos y sin acta
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload}>
            <Text style={styles.textDownload}>
              Formulario - Total sufragantes del puesto excede potencial
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload}>
            <Text style={styles.textDownload}>
              Formulario - Error aritmético(Más votos que votantes)
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload}>
            <Text style={styles.textDownload}>
              Formulario - Error aritmético(Total de votos es mayor que la
              sumatoria entre los candidatos)
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload}>
            <Text style={styles.textDownload}>
              Formulario - Error aritmético(Total de votos de otro partido es
              mayor que la sumatoria de los candidatos del partido)
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload}>
            <Text style={styles.textDownload}>
              Formulario - Error aritmético(Totalizar los votos del partido)
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default ModalDownload;

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
