import React from "react";
import { FlatList, Dimensions, Image, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

function RestaurantScreen({ route, navigation }) {
  const restaurant = route.params.restaurant;
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: restaurant.facility });
  }, [navigation]);

  return (
    <View>
      <Image style={styles.image} source={{ uri: restaurant.img_src }} />
      {/* <View style={styles.move}>
				<PieCh
					data={restaurant.data}
					width={400}
					height={400}
					style={styles.image}
					value={restaurant.current_capacity}
				/>
			</View> */}
      <View style={styles.detailsContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{restaurant.facility}</Text>
          <Text style={styles.subTitle}>{restaurant.facility_address}</Text>
          <Text style={styles.subTitle2}>{restaurant.facility_town}</Text>
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
    </View>
  );
}
const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
  },
  move: {
    bottom: 20,
  },
  detailsContainer: {},
  textContainer: {
    padding: 10,
    top: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  subTitle: {
    fontWeight: "300",
    fontSize: 20,
    marginVertical: 10,
  },
  subTitle2: {
    fontWeight: "300",
    fontSize: 20,
    marginBottom: 20,
  },
  mapcontainer: {
    bottom: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    borderRadius: 20,
    width: Dimensions.get("window").width,
    height: "60%",
  },
});

export default RestaurantScreen;
