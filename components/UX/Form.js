import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { useTheme } from "react-native-paper";
import Button from "./Button";

function Form(props) {
  const { colors } = useTheme();

  const [data, setData] = useState({
    username: "",
    password: "",
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });

  const textInputChange = (val) => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        username: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
  };

  const fetchLogin = (username,password) => {
    if(!data.isValidUser){
      Alert.alert("Error!", "El usuario debe tener al menos 4 caracteres", [
        { text: "Entendido" },
      ]);
    }else if(!data.isValidPassword){
      Alert.alert("Error!", "La contraseña debe tener al menos 4 caracteres", [
        { text: "Entendido" },
      ]);
    }else{
      props.loginHandle(username, password)
    }
  }

  const handlePasswordChange = (val) => {
    if (val.trim().length >= 6) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const handleValidUser = (val) => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        isValidUser: false,
      });
    }
  };

  return (
    <View>
      <Text
        style={[
          styles.text_footer,
          {
            color: colors.text,
          },
        ]}
      >
        Usuario
      </Text>
      <View style={styles.action}>
        <FontAwesome name="user-o" color={colors.text} size={20} />
        <TextInput
          placeholder="Su nombre de usuario"
          placeholderTextColor="#666666"
          style={[
            styles.textInput,
            {
              color: colors.text,
            },
          ]}
          autoCapitalize="none"
          onChangeText={(val) => textInputChange(val)}
          onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
        />
        {data.check_textInputChange ? (
          <Animatable.View animation="bounceIn">
            <Feather name="check-circle" color="green" size={20} />
          </Animatable.View>
        ) : null}
      </View>
      {data.isValidUser ? null : (
        <Animatable.View animation="fadeInLeft" duration={500}>
          <Text style={styles.errorMsg}>
            Al menos 4 caracteres en el usuario
          </Text>
        </Animatable.View>
      )}

      <Text
        style={[
          styles.text_footer,
          {
            color: colors.text,
            marginTop: 35,
          },
        ]}
      >
        Contraseña
      </Text>
      <View style={styles.action}>
        <Feather name="lock" color={colors.text} size={20} />
        <TextInput
          placeholder="Su clave de acceso"
          placeholderTextColor="#666666"
          secureTextEntry={data.secureTextEntry ? true : false}
          style={[
            styles.textInput,
            {
              color: colors.text,
            },
          ]}
          autoCapitalize="none"
          onChangeText={(val) => handlePasswordChange(val)}
        />
        <TouchableOpacity onPress={updateSecureTextEntry}>
          {data.secureTextEntry ? (
            <Feather name="eye-off" color="grey" size={20} />
          ) : (
            <Feather name="eye" color="grey" size={20} />
          )}
        </TouchableOpacity>
      </View>
      {data.isValidPassword ? null : (
        <Animatable.View animation="fadeInLeft" duration={500}>
          <Text style={styles.errorMsg}>
            Al menos 6 caracteres en la contraseña
          </Text>
        </Animatable.View>
      )}
      <View style={styles.button}>
        <Button
          label="Iniciar Sesión"
          styleText={{fontSize:19}}
          styleButton={{height:45,backgroundColor:'#FC5C06'}}
          onPress={() => fetchLogin(data.username, data.password)}
        />
      </View>
    </View>
  );
}

export default Form;

const styles = StyleSheet.create({
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -5,
    paddingLeft: 10,
    color: "#05375a",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    paddingTop: 20,
  },
});
