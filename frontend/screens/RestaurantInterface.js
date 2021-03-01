import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Modal, TouchableOpacity, ImageBackground, Alert } from "react-native";
import baseURL from "../assets/common/baseURL";
import axios from "axios";
import RestaurantEdit from "./RestaurantEdit";
import { TextInput } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { set } from "react-native-reanimated";

export default function RestaurantInterface({ navigation }) {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userAuthed, setUserAuthed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  /*         onPress={() => {
            navigation.navigate("Restaurant Login", {});
          }} */

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
        Alert.alert("Incorrect Credentials", "Please try again.");
      });
  };

  const submitLogin = async () => {
    if (username === "" || password === "") {
      Alert.alert("Incorrect Login", "Username and/or Password cannot be left blank.");
    } else {
      login();
      setModalVisible(false);
    }
  };

  return (
    <ImageBackground
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      source={require("../assets/background/canteen-vectors.jpg")}
    >
      <View style={{ marginTop: "-30%", marginBottom: "5%" }}>
        {!modalVisible && (
          <TouchableOpacity
            style={styles.portalButton}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <Text style={styles.button}>Login</Text>
          </TouchableOpacity>
        )}
        <Modal animationType="fade" visible={modalVisible} transparent={true}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={{ alignSelf: "flex-end", padding: 5 }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Ionicons name="exit-outline" size={24} color="black" />
              </TouchableOpacity>
              <TextInput
                mode="outlined"
                label="Username"
                style={[styles.input]}
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

              <TouchableOpacity onPress={submitLogin}>
                <Text style={styles.submit}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Restaurant Signup", {});
          }}
        >
          {!modalVisible && <Text style={styles.button}>Signup</Text>}
        </TouchableOpacity>
      </View>
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
  portalButton: {},
  centeredView: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    opacity: 0.98,
    height: 300,
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    elevation: 5,
  },
  input: {
    height: 50,
    width: 300,
    fontSize: 15,
    marginBottom: "5%",
  },
  button: {
    fontFamily: "Aurella",
    color: "white",
    borderWidth: 2,
    borderColor: "white",
    padding: 15,
    paddingHorizontal: 30,
    paddingBottom: 10,
    fontSize: RFValue(50),
    fontWeight: "900",
  },
  submit: {
    fontFamily: "Aurella",
    marginTop: 20,
    color: "black",
    borderWidth: 2,
    borderColor: "black",
    padding: 5,
    paddingHorizontal: 30,
    fontSize: RFValue(50),
  },
});
