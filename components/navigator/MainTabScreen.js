import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Camara from "../../screens/Camara";
import Senado from "../../screens/Senado";
import { TouchableOpacity } from "react-native";

const Tab = createBottomTabNavigator();

const CustomTabButtonLeft = (props) => (
  <TouchableOpacity
    {...props}
    style={
      props.accessibilityState.selected
        ? [props.style, { borderRightColor: '#8E8E8F', borderRightWidth: 0.5 }]
        : props.style
    }
  />
);
const CustomTabButtonRight = (props) => (
  <TouchableOpacity
    {...props}
    style={
      props.accessibilityState.selected
        ? [props.style, { borderLeftColor: '#8E8E8F', borderLeftWidth: 0.5 }]
        : props.style
    }
  />
);
/* const CustomTabButton = (props) => (
  <TouchableOpacity
    {...props}
    style={
      props.accessibilityState.selected
        ? [props.style, { borderTopColor: 'red', borderTopWidth: 2 }]
        : props.style
    }
  />
); */

const MainTabScreen = () => {

  return (
    <Tab.Navigator
    screenOptions={{
      // tabBarStyle: { position: 'absolute' },
      /* tabBarBackground: () => (
        <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
      ), */
      tabBarActiveTintColor: 'black',
      headerShown: false,
      tabBarHideOnKeyboard: true,
      tabBarLabelStyle: {
        fontSize: 15,
        position: 'absolute',
        textAlignVertical: 'center',
      }, 
    }}

      // initialRouteName="Home"
      // activeColor="#FFEF00"

      // barStyle={{ backgroundColor: 'black' }}
    >
      <Tab.Screen
        name="Cámara"
        style={{backgroundColor:'red'}}
        component={Camara}
        options={{
          tabBarButton: CustomTabButtonLeft,
        }}

      />
      <Tab.Screen
        name="Senado"
        component={Senado}
        options={{
          tabBarButton: CustomTabButtonRight,
        }}

      />
    </Tab.Navigator>
  );
};

export default MainTabScreen;
