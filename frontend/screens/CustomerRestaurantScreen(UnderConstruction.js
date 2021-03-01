import React from "react";
import { FlatList, Dimensions, Image, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import iconPreview from "../components/Icon";
import Icon from "../components/Icon";

// const iconBank = [
// 	{ id: 1, name: 'hamburger', family: 'FontAwesome5' },
// 	{ id: 2, name: 'hotdog', family: 'FontAwesome5' },
// 	{ id: 3, name: 'pizza-slice', family: 'FontAwesome5' },
// 	{ id: 4, name: 'food-drumstick', family: 'MaterialCommunityIcons' },
// 	{ id: 5, name: 'rice', family: 'MaterialCommunityIcons' },
// 	{ id: 6, name: 'noodles', family: 'MaterialCommunityIcons' },
// 	{ id: 7, name: 'egg', family: 'MaterialCommunityIcons' },
// 	{ id: 8, name: 'sausage', family: 'MaterialCommunityIcons' },
// 	{ id: 9, name: 'leaf', family: 'FontAwesome5' },
// 	{ id: 10, name: 'bread-slice', family: 'FontAwesome5' },
// 	{ id: 12, name: 'bacon', family: 'FontAwesome5' },
// 	{ id: 13, name: 'stroopwafel', family: 'FontAwesome5' },
// 	{ id: 14, name: 'food-croissant', family: 'MaterialCommunityIcons' },
// 	{ id: 15, name: 'cheese', family: 'FontAwesome5' },
// 	{ id: 16, name: 'fish', family: 'FontAwesome5' },
// 	{ id: 17, name: 'taco', family: 'MaterialCommunityIcons' },
// 	{ id: 18, name: 'apple-alt', family: 'FontAwesome5' },
// 	{ id: 19, name: 'corn', family: 'MaterialCommunityIcons' },
// 	{ id: 20, name: 'carrot', family: 'FontAwesome5' },
// 	{ id: 21, name: 'pepper-hot', family: 'FontAwesome5' },
// 	{ id: 22, name: 'ice-cream', family: 'FontAwesome5' },
// 	{ id: 23, name: 'cookie', family: 'FontAwesome5' },
// 	{ id: 24, name: 'fast-food', family: 'Ionicons' },
// 	{ id: 25, name: 'md-bonfire', family: 'Ionicons' },
// 	{ id: 26, name: 'fireplace', family: 'MaterialCommunityIcons' },
// 	{ id: 27, name: 'cocktail', family: 'FontAwesome5' },
// 	{ id: 28, name: 'ios-wine', family: 'Ionicons' },
// 	{ id: 29, name: 'wine-bottle', family: 'FontAwesome5' },
// 	{ id: 30, name: 'beer', family: 'FontAwesome5' },
// 	{ id: 31, name: 'coffee', family: 'FontAwesome5' },
// 	{ id: 32, name: 'bottle-soda-classic', family: 'MaterialCommunityIcons' },
// 	{ id: 33, name: 'seedling', family: 'FontAwesome5' },
// 	{ id: 34, name: 'wheelchair', family: 'FontAwesome5' },
// 	{ id: 35, name: 'volume-low', family: 'Ionicons' },
// 	{ id: 36, name: 'glass-cheers', family: 'FontAwesome5' },
// 	{ id: 37, name: 'grin-squint-tears', family: 'FontAwesome5' },
// 	{ id: 38, name: 'book-open-page-variant', family: 'MaterialCommunityIcons' },
// 	{ id: 39, name: 'hiking', family: 'FontAwesome5' },
// 	{ id: 40, name: 'baby-carriage', family: 'FontAwesome5' },
// 	{ id: 41, name: 'car', family: 'FontAwesome5' },
// 	{ id: 42, name: 'cart-plus', family: 'FontAwesome5' },
// 	{ id: 43, name: 'handshake', family: 'FontAwesome5' },
// ];

function RestaurantScreen({ route }) {
  const restaurant = route.params;

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
