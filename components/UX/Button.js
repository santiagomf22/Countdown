
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { StyleSheet } from 'react-native';


const Button = props => {
  return (
    <TouchableOpacity activeOpacity={0.8} {...props} style={{ ...styles.button, ...props.styleButton }}>
      <Text style={{ ...styles.buttonLabel, ...props.styleText }}>{props.label}</Text>
    </TouchableOpacity>
  );
}

export default Button;

const styles = StyleSheet.create( {
  button:{
    backgroundColor: 'black',
    borderRadius:4,
    justifyContent:'center',
    alignItems:'center'
  },
  buttonLabel:{
    color: 'white'
  }
})