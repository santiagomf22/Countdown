import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Alert
} from "react-native";
import { Audio } from "expo-av";
import { IconButton } from "react-native-paper";
import axios from "axios";

const AudioRecorder = (props) => {
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState({});
  const [message, setMessage] = useState("");

  const sendAudio = async () => {
    let file = recordings.file;
    let nameParts = file.split(".");
    let parts = file.split("/");
    let fileType = nameParts[nameParts.length - 1];
    let name = parts[parts.length - 1].split(".")[0];
    const audioToUpload = {
      name,
      uri: file,
      type: "audio/" + fileType
    };

    //const blobAudio = new Blob(recordings);
    const formData = new FormData();

    formData.append("file", audioToUpload);
    formData.append("oidMesa", props.oidMesa);
    formData.append("oidPuesto", props.oidPuesto);
    formData.append("oidTarjeton", props.oidTarjeton);
    formData.append("login", props.login);
    
    const xhr = new XMLHttpRequest();

    const res = await new Promise((resolve, reject) => {
      xhr.onreadystatechange = (e) => {
        if (xhr.readyState !== 4) {
          return;
        }

        if (xhr.status === 200) {
          // resolve(JSON.parse(xhr.responseText))
          resolve(xhr.responseText);
        } else {
          reject("Request Failed");
        }
      };
      xhr.open(
        "POST",
    //"http://35.231.9.84:8091/scriptcase/app/CountDown/ws_cd/index.php?audio"
        "http://35.228.188.222/countdown/ws_cd/index.php?audio"
      );
      xhr.setRequestHeader("Content-Type", "multipart/form-data");
      xhr.send(formData);
    });
    console.log("respuesta audio: ", res);
    if(res.status === "200"){
      Alert.alert(
        "Exitoso!",
        "El audio se envio correctamente",
        [{ text: "Entendido" }]
      );
    }else{
      Alert.alert(
        "Error",
        "Hubo un problema al enviar el audio, intentalo de nuevo",
        [{ text: "Entendido" }]
      );
    }

    setRecording();
    setRecordings({});
    props.onCancel();
  };

  const cancelarAudio = () => {
    props.onCancel();
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        setRecording(recording);
      } else {
        setMessage(
          "Por favor otorgale permisos de uso del micrifono a la aplicación "
        );
      }
    } catch (err) {
      console.error("Fallo al empezar a grabar", err);
    }
  };

  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    let updatedRecordings = { ...recordings };
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updatedRecordings = {
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    };

    setRecordings(updatedRecordings);
  };

  const getDurationFormatted = (millis) => {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  };

  return (
    <Modal transparent={false} visible={props.visible} animationType="slide">
      <View style={styles.container}>
        <Text>{message}</Text>
        <Text style={styles.textRecord}>
          {recording ? "Detener grabacion" : "Empezar a grabar"}
        </Text>
        <IconButton
          icon={recording ? "stop-circle" : "record-circle"}
          onPress={recording ? stopRecording : startRecording}
          size={60}
          color="red"
          style={{ marginBottom: 15 }}
        />

        {/* <TouchableOpacity
          style={styles.button}
          onPress={recording ? stopRecording : startRecording}
        >
          <Text style={styles.text}>
            {recording ? "Detener grabacion" : "Empezar a grabar"}
          </Text>
        </TouchableOpacity> */}

        {Object.entries(recordings).length !== 0 && (
          <View style={styles.row}>
            <Text style={styles.fill}>Recording {recordings.duration}</Text>
            {/* <Button
            style={styles.button}
            onPress={() => recordings.sound.replayAsync()}
            title="Reproducir"
          ></Button> */}

            <IconButton
              icon="play"
              onPress={() => recordings.sound.replayAsync()}
              size={25}
              style={{ marginRight: 40 }}
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.buttonEnviar}
          onPress={() => sendAudio()}
        >
          <Text style={styles.text}>ENVIAR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonCancelar}
          onPress={() => cancelarAudio()}
        >
          <Text style={styles.text}>CANCELAR</Text>
        </TouchableOpacity>

        <StatusBar style="auto" />
      </View>
    </Modal>
  );
};

export default AudioRecorder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#FC5C06",
  },
  textRecord: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  buttonEnviar: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#FC5C06",
    position: "absolute",
    bottom: 15,
    right: 15,
  },
  buttonCancelar: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#FC5C06",
    position: "absolute",
    bottom: 15,
    left: 15,
  },
});
