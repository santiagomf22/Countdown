import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Modal } from "react-native";
import { Avatar, Title, Caption, Drawer, Text } from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import AuthContext from "../components/context/auth/AuthContext";
import ModalDownload from "../components/ModalDownload";

export function DrawerContent(props) {
  const { authContext, nombre } = React.useContext(AuthContext);
  const [showModal,setShowModal] = useState(false);
  const downloadKit = () => {
    setShowModal(true)
  };

  const hideModal = () => {
    setShowModal(false);
  };



  return (
    <View style={{ flex: 1, backgroundColor: "#FC5C06" }}>
      <ModalDownload
        visible={showModal}
        onCancel={hideModal}
      />
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View
            style={{
              marginTop: 15,
              alignItems: "center",
            }}
          >
            <Avatar.Image
              source={{
                uri: "https://img.favpng.com/20/11/10/computer-icons-icon-design-png-favpng-8Hk26AsZVcQbfXKf83GxDkCZS.jpg",
              }}
              size={50}
            />
            <View style={{ alignItems: "center", width: "100%" }}>
              <Title style={styles.title}>Testigo Electoral</Title>
              <Text style={styles.name}>
                {nombre !== "" ? nombre : "Usuario"} 
              </Text>
              <View style={{ height: 20 }}></View>
              <Text style={styles.captionTitle}>Soporte técnico</Text>
              <Text style={styles.caption}>Lineas de atención:</Text>
              <Text style={styles.caption}>3112587894</Text>
              <Text style={styles.caption}>3214587412</Text>
            </View>
            <TouchableOpacity
              style={{ flexDirection: "row", marginTop: 50 }}
              onPress={downloadKit}
            >
              <Text style={styles.captionDownload}>KIT ELECTORAL</Text>
              <Icon name="download" color="white" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="exit-to-app" color="#FEF92C" size={size} />
          )}
          label="Cerrar Sesión"
          onPress={() => {
            authContext.signOut();
            props.navigation.navigate("Inicio");
          }}
          labelStyle={{ color: "#FEF62B" }}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    marginTop: 3,
    fontWeight: "bold",
    color: "white",
  },
  name: {
    fontSize: 15,
    color: "white",
  },
  captionTitle: {
    fontSize: 16,
    lineHeight: 14,
    fontWeight: "bold",
    height: 25,
    paddingTop: 5,
    color: "white",
  },
  captionDownload: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "bold",
    height: 25,
    paddingTop: 5,
    color: "white",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    color: "white",
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    borderTopColor: "#EA5605",
    borderTopWidth: 1,
    paddingBottom: 20,
  },
});



