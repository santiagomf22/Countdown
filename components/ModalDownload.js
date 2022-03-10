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
  Linking
} from "react-native";

function ModalDownload(props) {
  const windowHeight = Dimensions.get("window").height;
  const newHeight = windowHeight * 0.2;

  const fetchForms = (id) =>{
    alertIndex(id)
  }

  const alertIndex = (url) => {
    Linking.canOpenURL(url)
		.then(async (supported) => {
			if (supported) {
				try {
          return await Linking.openURL(url);
        } catch {
          return null;
        }
			}else{
        Alert.alert("Error", "Lo sentimos no se puede abrir el archivo, inténtelo mas tarde o comuníquese con un administrador", [{ text: "Entendido" }]);
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
        <ScrollView>
          <TouchableOpacity style={styles.btnDownload} onPress={()=>fetchForms("http://35.228.188.222/countdown/_lib/file/doc/documentosCountd/formatosTestigos/FTO%20R1-%20Reclamaci%c3%b3n%20por%20ERROR%20ARITM%c3%89TICO_POR%20ANULACI%c3%93N%20VOTOS%20DE%20MIRA%20EN%20RECUENTO_DEFENSA.doc.docx")}>
            <Text style={styles.textDownload}>
              Formulario - Error aritmético por anulación de votos
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload} onPress={()=>fetchForms("http://35.228.188.222/countdown/_lib/file/doc/documentosCountd/formatosTestigos/FTO%20R2-%20Reclamaci%c3%b3n%20por%20ERROR%20ARITM%c3%89TICO_AUMENTO%20VOTACI%c3%93N%20OTROS%20PARTIDOS%20EN%20RECUENTO_ATAQUE.doc.docx")}>
            <Text style={styles.textDownload}>
              Formulario - Error aritmético aumento votación otros partidos
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload} onPress={()=>fetchForms("http://35.228.188.222/countdown/_lib/file/doc/documentosCountd/formatosTestigos/FTO%20R3-%20Reclamaci%c3%b3n%20por%20TACHADURAS%20Y%20ENMENDADURAS.doc.docx")}>
            <Text style={styles.textDownload}>
              Formulario - Tachaduras y enmendaduras
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload} onPress={()=>fetchForms("http://35.228.188.222/countdown/lib/file/doc/documentosCountd/formatosTestigos/FTO%20R4-%20Reclamaci%c3%b3n%20por%20EXTEMPORANEIDAD%20ATAQUE.odt.docx")}>
            <Text style={styles.textDownload}>
              Formulario - Extemporaneidad
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload} onPress={()=>fetchForms("http://35.228.188.222/countdown/lib/file/doc/documentosCountd/formatosTestigos/FTO%20R5-%20Reclamaci%c3%b3n%20por%20DIFERENCIA%2010_DEFENSA.doc.docx")}>
            <Text style={styles.textDownload}>Formulario - Diferencia 10%</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload} onPress={()=>fetchForms("http://35.228.188.222/countdown/_lib/file/doc/documentosCountd/formatosTestigos/FTO%20R6-%20Reclamaci%c3%b3n%20por%20FALTA%20DE%20FIRMAS%20DE%20LOS%20JURADOS_ATAQUE.doc.docx")}>
            <Text style={styles.textDownload}>
              Formulario - Falta de firmas de los jurados
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload} onPress={()=>fetchForms("http://35.228.188.222/countdown/lib/file/doc/documentosCountd/formatosTestigos/FTO%20R7-%20Reclamaci%c3%b3n%20por%20VOTOS%20DESTRUIDOS%20O%20PERDIDOS%20Y%20SIN%20ACTA%20ATAQUE.doc.docx")}>
            <Text style={styles.textDownload}>
              Formulario - Votos destruidos o perdidos y sin acta
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload} onPress={()=>fetchForms("http://35.228.188.222/countdown/_lib/file/doc/documentosCountd/formatosTestigos/FTO%20R8-%20Reclamaci%c3%b3n%20por%20TOTAL%20SUFRAGANTES%20DEL%20PUESTO%20EXCEDE%20POTENCIAL_ATAQUE.docx")}>
            <Text style={styles.textDownload}>
              Formulario - Total sufragantes del puesto excede potencial
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload} onPress={()=>fetchForms("http://35.228.188.222/countdown/lib/file/doc/documentosCountd/formatosTestigos/FTO%20R9-Reclamaci%c3%b3n%20por%20ERROR%20ARITM%c3%89TICO_M%c3%81S%20VOTOS%20QUE%20VOTANTES_ATAQUE.docx")}>
            <Text style={styles.textDownload}>
              Formulario - Error aritmético(Más votos que votantes)
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload} onPress={()=>fetchForms("http://35.228.188.222/countdown/_lib/file/doc/documentosCountd/formatosTestigos/FTO%20R10-%20Reclamaci%c3%b3n%20por%20ERROR%20ARITM%c3%89TICO_DEFENSA_TOTAL%20DE%20VOTOS%20DE%20MIRA%20ES%20MAYOR%20QUE%20LA%20SUMATORIA%20ENTRE%20LOS%20CANDIDATOS%20DE%20MIRA.docx")}>
            <Text style={styles.textDownload}>
              Formulario - Error aritmético(Total de votos es mayor que la sumatoria entre los candidatos)
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload} onPress={()=>fetchForms("http://35.228.188.222/countdown/_lib/file/doc/documentosCountd/formatosTestigos/FTO%20R11-%20Reclamaci%c3%b3n%20por%20ERROR%20ARITM%c3%89TICO_ATAQUE_TOTAL%20DE%20VOTOS%20DE%20OTRO%20PARTIDO%20ES%20MAYOR%20QUE%20LA%20SUMATORIA%20DE%20LOS%20CANDIDATOS%20DEL%20PARTIDO.docx")}>
            <Text style={styles.textDownload}>
              Formulario - Error aritmético(Total de votos de otro partido es mayor que la sumatoria de los candidatos del partido)
            </Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDownload} onPress={()=>fetchForms("http://35.228.188.222/countdown/_lib/file/doc/documentosCountd/formatosTestigos/FTO%20R12-%20Reclamaci%c3%b3n%20por%20ERROR%20ARITM%c3%89TICO_DEFENSA_AL%20TOTALIZAR%20LOS%20VOTOS%20DEL%20PARTIDO%20MIRA.docx")}>
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
