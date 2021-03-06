import React from "react";
import { FlatList, Dimensions, Image, StyleSheet, Text, View, ScrollView, ImageBackground } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import MapView, { Marker } from "react-native-maps";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Icon, Button } from "react-native-elements";
import iconBank from "../components/iconbank";

function RestaurantScreen({ route, navigation }) {
  const restaurant = route.params.restaurant;
  const showIcons = () => {
    return restaurant.icon_arr.map((key, i) => {
      return (
        <View key={i} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Icon
            name={iconBank[key].name}
            style={styles.icon}
            type={iconBank[key].family}
            size={RFValue(20)}
            color="white"
          />
          <Text style={{ fontSize: RFValue(16), color: "white", fontFamily: "Kg" }}> {iconBank[key].feature} </Text>
          <Icon
            name={iconBank[key].name}
            style={styles.icon}
            type={iconBank[key].family}
            size={RFValue(20)}
            color="white"
          />
        </View>
      );
    });
  };

  return (
    <ScrollView>
      <ImageBackground
        style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center" }}
        source={require("../assets/background/blankchalk.jpg")}
        blurRadius={0}
      >
        <View style={styles.detailsContainer}>
          <View style={[styles.sectionContainer]}>
            <Text style={styles.title}>{restaurant.facility}</Text>
          </View>
          {route.params.msg && (
            <View style={[styles.sectionContainer]}>
              <Text style={[styles.subTitle, { fontSize: RFValue(20) }]}>"{route.params.msg}"</Text>
            </View>
          )}
          <View style={[styles.sectionContainer, { paddingBottom: 20 }]}>
            <Text style={[styles.subTitle, { fontSize: RFValue(26) }]}>{restaurant.permit_type}</Text>
            {showIcons()}
          </View>
          <View
            style={[
              styles.sectionContainer,
              { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
            ]}
          >
            <View>
              <Text style={styles.subTitle}>Current Capacity: {route.params.current_capacity}</Text>
              <Text style={styles.subTitle}>Max Capacity: {route.params.max_capacity}</Text>
            </View>
            <AnimatedCircularProgress
              size={100}
              width={15}
              fill={(route.params.current_capacity / route.params.max_capacity) * 100}
              tintColor="white"
              backgroundColor="black"
              rotation={Number(0)}
            >
              {() => (
                <Text style={{ color: "white", fontSize: RFValue(30) }}>
                  {Math.round((route.params.current_capacity / route.params.max_capacity) * 100)}%
                </Text>
              )}
            </AnimatedCircularProgress>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.subTitle}>{restaurant.facility_address}</Text>
            <Text style={styles.subTitle}>{restaurant.facility_town}</Text>
          </View>

          <View style={styles.mapcontainer}>
            <MapView
              initialRegion={{
                latitude: route.params.coordinates.latitude,
                longitude: route.params.coordinates.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              style={styles.map}
            >
              <Marker
                title={restaurant.facility}
                coordinate={{
                  latitude: route.params.coordinates.latitude,
                  longitude: route.params.coordinates.longitude,
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
  sectionContainer: {
    alignSelf: "center",
    width: "90%",
    padding: 10,
    textAlignVertical: "center",
    borderBottomWidth: 1,
    borderColor: "lightgrey",
  },
  title: {
    fontSize: RFValue(50),
    fontFamily: "Kg",
    fontWeight: "500",
    color: "white",
    textAlign: "center",
  },
  subTitle: {
    fontFamily: "Kg",
    fontWeight: "300",
    fontSize: RFValue(22),
    color: "white",
    textAlign: "center",
    paddingVertical: 10,
  },
  mapcontainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 60,
  },
  map: {
    width: "90%",
    aspectRatio: 1,
  },
});

export default RestaurantScreen;
