import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthContext from "../components/context/auth/AuthContext";
import RootStackScreen from "./RootStackScreen";
import { DrawerContent } from "./DrawerContent";


import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Image } from "react-native";
import MainTabScreen from "../components/navigator/MainTabScreen";
import Camara from "./Camara";
import CamaraView from "./CamaraView";
import SenadoView from "./SenadoView";
import Senado from "./Senado";
import ListaMesas from "./ListaMesas"
import AgregarMesa from "./AgregarMesa"
import CamaraSenado from "./CamaraSenado";


const Main = (props) => {
  const { authContext,userToken } = useContext(AuthContext);

  useEffect(() => {
    authContext.getToken();
  }, []);

  const Drawer = createDrawerNavigator();



  const LogoTitle = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          alignItems: "center"
        }}
      >
        <Image
          style={{ width: "100%", height: 50, resizeMode: "contain" }}
          source={require("../assets/logo_countdown.png")}
        />
      </View>
    );
  };

  return (
    <NavigationContainer>
      {userToken !== null ? (
        <Drawer.Navigator
          drawerContent={(props) => <DrawerContent {...props} />}
        >
          <Drawer.Screen
            name="Inicio"
            component={ListaMesas}
            options={{
              orientation: "portrait",
              title: "Inicio",
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: '#FC5C06', //Set Header color
              },
              headerTitle: (props) => <LogoTitle {...props} />
            }} 
          />
          <Drawer.Screen
            name="AgregarMesa"
            component={AgregarMesa}
            options={{
              orientation: "portrait",
              title: "Agregar Mesa",
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: '#FC5C06', //Set Header color
              },
              headerTitle: (props) => <LogoTitle {...props} />
            }} 
          />
          <Drawer.Screen
            name="CamaraSenado"
            component={CamaraSenado}
            options={{
              orientation: "portrait",
              title: "Camara o senado",
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: '#FC5C06', //Set Header color
              },
              headerTitle: (props) => <LogoTitle {...props} />
            }} 
          />
          <Drawer.Screen
            name="Camara"
            component={Camara}
            options={{
              orientation: "portrait",
              title: "Camara",
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: '#FC5C06', //Set Header color
              },
              headerTitle: (props) => <LogoTitle {...props} />
            }} 
          />
          <Drawer.Screen
            name="Senado"
            component={Senado}
            options={{
              orientation: "portrait",
              title: "Senado",
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: '#FC5C06', //Set Header color
              },
              headerTitle: (props) => <LogoTitle {...props} />
            }} 
          />
          <Drawer.Screen
            name="CamaraView"
            component={CamaraView}
            options={{
              orientation: "portrait",
              title: "Vista camara",
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: '#FC5C06', //Set Header color
              },
              headerTitle: (props) => <LogoTitle {...props} />
            }} 
          />
          <Drawer.Screen
            name="SenadoView"
            component={SenadoView}
            options={{
              orientation: "portrait",
              title: "Vista senado",
              headerTitleAlign: "center",
              headerStyle: {
                backgroundColor: '#FC5C06', //Set Header color
              },
              headerTitle: (props) => <LogoTitle {...props} />
            }} 
          />
        </Drawer.Navigator>
      ) : (
        <RootStackScreen />
      )}
    </NavigationContainer>
  );
}

export default Main;

