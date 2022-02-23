import React from 'react';

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from './Login';

const RootStack = createNativeStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator headerMode='none'>
        <RootStack.Screen 
            name="LoginScreen" 
            component={Login}
            options={{
                headerShown: false,
                orientation: "portrait",
                title:'Inicio sesión'
              }} 
        />
    </RootStack.Navigator>
);

export default RootStackScreen;