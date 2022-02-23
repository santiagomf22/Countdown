import "react-native-gesture-handler";
import React from "react";
import AuthState from "./components/context/auth/AuthState";
import Main from "./screens/Main";


export default function App() {

  return (
      <AuthState>
          <Main />
      </AuthState>
  );
}

