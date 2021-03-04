import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Alert, TouchableOpacity, ImageBackground } from "react-native";
import baseURL from "../assets/common/baseURL";
import axios from "axios";
import { TextInput } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Icon } from "react-native-elements";

export default function RestaurantLogin({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 15, padding: 5 }} onPress={() => navigation.navigate("Home Screen", {})}>
          <Icon name="home" type="font-awesome-5" size={RFValue(24)} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userAuthed, setUserAuthed] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setToken("");
      setUserAuthed(false);
      return () => {
        setToken("");
        setUserAuthed(false);
      };
    }, [])
  );

  useEffect(() => {
    if (userAuthed) {
      navigation.navigate("Restaurant Edit", { token: token });
    }
  }, [userAuthed]);

  const onChangeUser = (input) => {
    setUsername(input);
  };

  const onChangePass = (input) => {
    setPassword(input);
  };

  const login = async () => {
    await axios
      .post(`${baseURL}users/login`, {
        userName: username,
        password: password,
      })
      .then((res) => {
        setToken(res.data);
        setUserAuthed(true);
      })
      .catch((err) => {
        Alert.alert("Incorrect Credentials");
      });
  };

  const submitLogin = async () => {
    if (username === "" || password === "") {
      Alert.alert("Incorrect Login", "Username and/or Password cannot be left blank.");
    } else {
      login();
    }
  };

  return (
    <ImageBackground
      style={{ flex: 1, alignItems: "center" }}
      source={require("../assets/background/conceptual_food_photography_benito_martin_and_gemma_lush_01.jpg")}
    >
      <TextInput
        mode="outlined"
        label="Username"
        style={[styles.input, { marginTop: "20%" }]}
        onChangeText={(input) => onChangeUser(input)}
        theme={{
          colors: {
            text: "black",
            primary: "#5700FF",
            underlineColor: "transparent",
          },
        }}
      />
      <TextInput
        mode="outlined"
        style={styles.input}
        label="Password"
        secureTextEntry={true}
        onChangeText={(input) => onChangePass(input)}
        theme={{
          colors: {
            text: "black",
            primary: "#5700FF",
            underlineColor: "transparent",
          },
        }}
      />

      <TouchableOpacity style={{ marginTop: "10%" }} onPress={submitLogin}>
        <Text style={styles.button}>Login</Text>
      </TouchableOpacity>

      <StatusBar style="light" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  input: {
    height: 50,
    width: 300,
    fontSize: 15,
    marginBottom: 20,
  },
  button: {
    color: "#5700FF",
    borderWidth: 2,
    borderColor: "#5700FF",
    padding: 5,
    paddingHorizontal: 20,
    fontSize: RFValue(26),
    fontWeight: "900",
  },
});
