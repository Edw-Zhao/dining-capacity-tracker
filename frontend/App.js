import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, SafeAreaView, TouchableOpacity, ImageBackground, Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CustomerData from "./screens/CustomerData(UnderConstruction)";
import CustomerRestaurantScreen from "./screens/CustomerRestaurantScreen(UnderConstruction)";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, HeaderBackButton } from "@react-navigation/stack";
import RestaurantLogin from "./screens/RestaurantLogin";
import RestaurantEdit from "./screens/RestaurantEdit";
import RestaurantInterface from "./screens/RestaurantInterface";
import RestaurantSignUp from "./screens/RestaurantSignUp";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { TextInput } from "react-native-paper";
import { useFonts } from "@expo-google-fonts/inter";

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      source={require("./assets/background/30vau2buydx1x42.jpg")}
    >
      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          As of Feb. 27, 2021, COVID-19 safety countermeasures for social gatherings include:
        </Text>
        <Text style={styles.noticeTextList}>
          Gathering limit for close social groups - you can form a close social group of up to 10 people without social
          distancing; you should try to keep this group consistent.
        </Text>
        <Text style={styles.noticeTextList}>
          Indoor gathering limit with social distancing for events and activities hosted by a recognized business or
          organization - 50% of the venue’s capacity up to 100 people maximum indoors (including spectators of sports
          and performing arts).
        </Text>
        <Text style={[styles.noticeText, { marginBottom: 0 }]}>Please apply safe and healthy practices</Text>
      </View>
      <View style={{ marginBottom: "5%" }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Customer Data", {});
          }}
        >
          <Text style={styles.button}>Customer Portal</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Restaurant Login/Signup", {});
          }}
        >
          <Text style={styles.button}>Restaurant Owner Portal</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </ImageBackground>
  );
};

export default function App() {
  let [fontsLoaded] = useFonts({
    Aurella: require("./assets/fonts/Aurella.ttf"),
    KGBroken: require("./assets/fonts/KGBrokenVesselsSketch.ttf"),
    CoalHand: require("./assets/fonts/CoalhandLukeTRIAL.ttf"),
    DKMid: require("./assets/fonts/DkMidnightChalkerRegular-lGWV.otf"),
    Candy: require("./assets/fonts/CANDY___.ttf"),
    Kg: require("./assets/fonts/KgTen.ttf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;

  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.allowFontScaling = false;

  const Stack = createStackNavigator();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home Screen" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="Customer Data"
            component={CustomerData}
            options={{
              title: "Restaurants",
              headerStyle: { backgroundColor: "black" },
              headerTintColor: "white",
            }}
          />
          <Stack.Screen
            name="Customer Restaurant Screen"
            component={CustomerRestaurantScreen}
            options={{
              headerStyle: {
                backgroundColor: "black",
              },
              headerTintColor: "white",
              headerTitle: "Restaurant Details",
            }}
          />
          <Stack.Screen
            name="Restaurant Edit"
            component={RestaurantEdit}
            options={{
              title: "Restaurant Edit/Update",
              headerStyle: { backgroundColor: "black" },
              headerTintColor: "white",
            }}
          />
          <Stack.Screen
            name="Restaurant Login/Signup"
            component={RestaurantInterface}
            options={{
              title: "Restaurant Owner Interface",
              headerStyle: { backgroundColor: "black" },
              headerTintColor: "white",
            }}
          />
          <Stack.Screen
            name="Restaurant Login"
            component={RestaurantLogin}
            options={{
              title: "Login",
              headerStyle: { backgroundColor: "black" },
              headerTintColor: "white",
            }}
          />
          <Stack.Screen
            name="Restaurant Signup"
            component={RestaurantSignUp}
            options={{
              title: "Restaurant Owner Registration",
              headerStyle: { backgroundColor: "black" },
              headerTintColor: "white",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  button: {
    fontFamily: "CoalHand",
    color: "white",
    borderWidth: 3,
    borderColor: "lightgrey",
    borderRadius: 10,
    padding: 10,
    paddingTop: 17.5,
    paddingBottom: 0,
    fontSize: RFValue(26),
    fontWeight: "900",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  notice: {
    fontFamily: "KGBroken",
    marginTop: "30%",
    marginBottom: "5%",
    color: "white",
    fontSize: RFValue(20),
    width: "85%",
    textAlign: "center",
  },
  noticeText: {
    fontFamily: "KGBroken",
    color: "white",
    fontSize: RFValue(20),
    width: "100%",
    textAlign: "center",
    marginBottom: "5%",
  },
  noticeTextList: {
    fontFamily: "KGBroken",
    color: "white",
    fontSize: RFValue(11),
    width: "100%",
    marginBottom: "5%",
  },
});
