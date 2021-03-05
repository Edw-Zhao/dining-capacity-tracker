import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Alert, TouchableOpacity, ImageBackground, Modal } from "react-native";
import baseURL from "../assets/common/baseURL";
import axios from "axios";
import { TextInput } from "react-native-paper";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Icon } from "react-native-elements";

export default function RestaurantInterface({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 7.5, padding: 5 }}
          onPress={() => navigation.navigate("Home Screen", {})}
        >
          <Icon name="home" type="font-awesome-5" size={RFValue(24)} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [valKey, setValKey] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [res, setRes] = useState({});
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const onSubmit = () => {
    if (valKey !== "") {
      const fetchData = async () => {
        // Get Backend Data
        await axios
          .get(`${baseURL}restaurants/${valKey}`)
          .then((res) => {
            setRes(res);
            setDataLoaded(true);
          })
          .catch((err) => {
            console.log(err);
            Alert.alert("Incorrect Validation Key");
            setDataLoaded(false);
          });
      };
      fetchData();
    }
  };

  const onSignup = async () => {
    await axios
      .post(`${baseURL}users/signup`, {
        userName: userName,
        password: password,
        facilityId: res.data._id,
      })
      .then((res) => {
        Alert.alert("Successful Registration!", "Please login for first-time setup");
      })
      .catch((err, res) => {
        Alert.alert("Error");
        console.log(err);
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
      style={{
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
      source={require("../assets/background/v149-lp-244-foodillustration_2.jpg")}
    >
      <View style={{ height: "100%", padding: 60, width: "100%", alignItems: "center", marginTop: "7.5%" }}>
        <TextInput
          mode="outlined"
          label="Validation Key"
          style={styles.input}
          onChangeText={(input) => setValKey(input)}
        />
        <Button title="Submit" onPress={onSubmit} color="rgb(98,0,238)" />
        {dataLoaded && (
          <View style={styles.signupForm}>
            <Text style={{ marginBottom: "5%", color: "black", fontSize: RFValue(14), textAlign: "center" }}>
              Registering for {res.data.facility} at {res.data.facility_address}
            </Text>
            <View
              style={{
                borderBottomColor: "rgb(98,0,238)",
                borderBottomWidth: 2,
                width: "100%",
                marginBottom: "10%",
              }}
            />
            <TextInput
              mode="outlined"
              label="Username"
              style={styles.inputForm}
              onChangeText={(input) => setUserName(input)}
            />
            <TextInput
              mode="outlined"
              label="Password"
              style={styles.inputForm}
              secureTextEntry={true}
              onChangeText={(input) => setPassword(input)}
            />
            <View style={{ marginTop: "5%" }}>
              <Button title="Sign Up" onPress={onSignup} color="rgb(98,0,238)" />
            </View>
          </View>
        )}
      </View>
      <StatusBar style="light" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: "100%",
  },
  signupForm: {
    width: "100%",
    paddingTop: "10%",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  input: {
    height: 40,
    width: "80%",
    fontSize: RFValue(12),
    marginBottom: "10%",
  },
  inputForm: {
    height: 50,
    width: "80%",
    fontSize: 15,
    marginBottom: 20,
  },
});
