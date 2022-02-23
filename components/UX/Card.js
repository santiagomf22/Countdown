import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = props => {
  return (
    <View style={{ ...styles.card, ...props.style }}>{props.children}</View>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    shadowOpacity: 0.1,
    elevation: 1,
    padding: 1,
    borderRadius: 1,
    margin: 1
  }
});

export default Card;
