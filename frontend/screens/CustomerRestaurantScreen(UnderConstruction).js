import React from "react";
import { FlatList, Dimensions, Image, StyleSheet, Text, View, ScrollView, ImageBackground } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import MapView, { Marker } from "react-native-maps";

function RestaurantScreen({ route, navigation }) {
  const restaurant = route.params.restaurant;

  return (
    <ScrollView>
      <ImageBackground
        style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center" }}
        source={require("../assets/background/blankchalk.jpg")}
        blurRadius={0}
      >
        <View style={styles.detailsContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{restaurant.facility}</Text>
            <Text style={styles.subTitle}>{restaurant.facility_address}</Text>
            <Text style={styles.subTitle2}>{restaurant.facility_town}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.subTitle}>Current Capacity: {restaurant.current_capacity}</Text>
            <Text style={styles.subTitle}>Max Capacity: {restaurant.max_capacity}</Text>
          </View>

          <View style={styles.mapcontainer}>
            <MapView
              initialRegion={{
                latitude: restaurant.location_latitude,
                longitude: restaurant.location_longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              style={styles.map}
            >
              <Marker
                title={restaurant.facility}
                coordinate={{
                  latitude: restaurant.location_latitude,
                  longitude: restaurant.location_longitude,
                }}
              />
            </MapView>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 100,
  },
  move: {
    bottom: 20,
  },
  detailsContainer: { width: "100%" },
  textContainer: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
  },
  title: {
    fontSize: RFValue(50),
    fontFamily: "Kg",
    fontWeight: "500",
    color: "white",
    borderWidth: 1,
    textAlign: "center",
  },
  subTitle: {
    fontFamily: "Kg",
    fontWeight: "300",
    fontSize: RFValue(22),
    marginVertical: 10,
    color: "white",
    textAlign: "center",
  },
  subTitle2: {
    fontWeight: "300",
    fontSize: 20,
    marginBottom: 20,
    color: "white",
    textAlign: "center",
  },
  mapcontainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 500,
  },
  map: {
    borderRadius: 20,
    width: Dimensions.get("window").width,
    height: "60%",
  },
});

export default RestaurantScreen;
