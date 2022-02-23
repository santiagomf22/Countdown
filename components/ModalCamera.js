import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

function ModalCamera(props) {
  const windowHeight = Dimensions.get("window").height;
  const newHeight = windowHeight * 0.29;

  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    let localUri = result.uri;
    let filename = localUri.split("/").pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append('file', "Hola");

    /* let fecha = new Date();
    let { type, uri } = result;
    const fileToUpload = {
      name: "minion.jpg",
      uri,
      fecha,
      type: "application/" + type,
    };
    console.log("File to upload ", fileToUpload);
    formData.append("file", fileToUpload);
    formData.append("login", userName);
    formData.append("oidMesa", mesaCod); */
    /* formData.append("oidPuesto", puestoCod);
    formData.append("oidTarjeton", 1);  */

    // Explore the result
    console.log("imagen ", result);

    if (!result.cancelled) {
      props.uriImage(formData);
    }
  };

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      props.uriImage(result);
    }
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
        <Text style={{ textAlign: "center", color: "#000", fontSize: 17 }}>
          Seleccione una opción...
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={openCamera}>
            <Text style={{ color: "#000", fontWeight: "bold", fontSize: 17 }}>
              Usar cámara
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={showImagePicker}>
            <Text style={{ color: "#000", fontWeight: "bold", fontSize: 17 }}>
              Seleccionar de archivos
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default ModalCamera;

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
});