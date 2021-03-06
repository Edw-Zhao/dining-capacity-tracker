import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity, ImageBackground, Alert } from "react-native";
import baseURL from "../assets/common/baseURL";
import axios from "axios";
import RestaurantEdit from "./RestaurantEdit";
import { TextInput } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Icon, Button } from "react-native-elements";

export default function RestaurantInterface({ navigation }) {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userAuthed, setUserAuthed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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
      <View style={{ marginBottom: "5%" }}>
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
                <Icon name="exit-outline" type="ionicon" size={24} color="rgb(98,0,238)" />
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
              <TouchableOpacity style={{ marginTop: "7.5%" }} onPress={submitLogin}>
                <Text style={styles.button}>Login</Text>
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
      <Text style={styles.note}>
        To register your restaurant, email example@ns.gov with proof of restaurant ownership for a validation key.
      </Text>
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
    color: "white",
    borderRadius: 4,
    backgroundColor: "rgb(98,0,238)",
    padding: 5,
    paddingBottom: 10,
    width: 125,
    fontSize: RFValue(28),
    fontWeight: "900",
    textAlign: "center",
    textAlignVertical: "center",
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
  note: {
    marginTop: 75,
    width: "70%",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 10,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "rgb(98,0,238)",
    fontSize: RFValue(20),
    textAlign: "center",
  },
});
