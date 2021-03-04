import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
  ImageBackground,
} from "react-native";
import baseURL from "../assets/common/baseURL";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { TextInput } from "react-native-paper";
import * as Location from "expo-location";
import CollapsibleView from "@eliav2/react-native-collapsible-view";
import MapView, { Marker } from "react-native-maps";
import iconBank from "../components/iconbank";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Icon } from "react-native-elements";

export default function RestaurantEdit({ route, navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 10, padding: 5 }} onPress={() => navigation.navigate("Home Screen", {})}>
          <Icon name="home" type="font-awesome-5" size={RFValue(24)} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const token = route.params.token;
  const decoded = jwt_decode(token, { body: true });
  const [res, setRes] = useState();
  const [reqMaxCapacity, setReqMaxCapacity] = useState("");
  const [reqCurrentCapacity, setReqCurrentCapacity] = useState("");
  const [reqImage, setReqImage] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [coordLoaded, setCoordLoaded] = useState(false);
  const [reqCoord, setReqCoord] = useState("");
  const [reqMsg, setReqMsg] = useState("");
  const [activeIconIndex, setActiveIconIndex] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`${baseURL}restaurants/${decoded.facilityId}`).then((res) => {
        setRes(res.data);
        if (res.data.registered) {
          setReqCoord({ latitude: res.data.location_latitude, longitude: res.data.location_longitude });
          setReqMaxCapacity(res.data.max_capacity);
          setReqCurrentCapacity(res.data.current_capacity);
          setReqImage(res.data.img_src);
          setCoordLoaded(true);
          setActiveIconIndex(res.data.icon_arr);
          setReqMsg(res.data.msg);
        } else {
          setReqMaxCapacity(0);
          setReqCurrentCapacity(0);
          setReqImage(
            "https://images.everydayhealth.com/images/diet-nutrition/what-is-a-plant-based-diet-beginners-guide-food-list-benefits-722x406.jpg?sfvrsn=3d8f397_0"
          );
        }
        setDataLoaded(true);
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (dataLoaded && res.registered === false) {
      console.log("activated");
      const getcoord = async () => {
        let coord = await Location.geocodeAsync(res.facility_address + " " + res.facility_town);
        setReqCoord(coord[0]);
        setCoordLoaded(true);
      };
      getcoord();
    }
  }, [dataLoaded]);

  const increaseCounter = () => {
    setReqCurrentCapacity(reqCurrentCapacity + 1);
  };

  const decreaseCounter = () => {
    console.log(activeIconIndex);
    if (reqCurrentCapacity > 0) {
      setReqCurrentCapacity(reqCurrentCapacity - 1);
    }
  };

  const update = async () => {
    await axios
      .put(
        `${baseURL}restaurants/${res._id}`,
        {
          registered: true,
          max_capacity: reqMaxCapacity,
          current_capacity: reqCurrentCapacity,
          location_latitude: reqCoord.latitude,
          location_longitude: reqCoord.longitude,
          img_src: reqImage,
          icon_arr: activeIconIndex,
          msg: reqMsg,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        Alert.alert("Updated!");
      })
      .catch((err) => {
        Alert.alert("Error");
        console.log(err);
      });
  };

  // Preview Component *************************

  const iconPreview = () => {
    return activeIconIndex.map((key) => {
      <Icon
        key={key}
        name={iconBank[key].name}
        style={styles.icon}
        type={iconBank[key].family}
        size={RFValue(22)}
        color="black"
      />;
    });
  };

  const previewRow = () => {
    const capaFrac = () => {
      return (
        <Text style={styles.rowText}>
          {String(Math.round((reqCurrentCapacity / reqMaxCapacity) * 1000) / 10) + "% Full"}
        </Text>
      );
    };

    return (
      <CollapsibleView
        style={styles.rowEntry}
        title={
          <View style={styles.rowTitle}>
            <Image source={{ uri: reqImage }} style={styles.tinyLogo} />
            <View style={{ textAlign: "center" }}>
              <Text style={styles.rowText}>{String(res.facility)}</Text>
              <View style={[styles.rowFlex, { justifyContent: "space-around" }]}>{iconPreview()}</View>
            </View>
            <View>{capaFrac()}</View>
          </View>
        }
      >
        <View style={styles.rowEntryExtra}>
          <View style={{ flexDirection: "row" }}>
            <View>
              <Text style={{ marginBottom: 20, marginTop: 20, fontSize: 17 }}> {reqMsg} </Text>
              <Text>Type: {res.permit_type}</Text>
              <Text>City: {res.facility_town}</Text>
              <Text>Address: {res.facility_address}</Text>
              <Text>Max Capacity: {reqMaxCapacity}</Text>
              <Text>Current Capacity: {reqCurrentCapacity}</Text>
            </View>
            <TouchableHighlight style={{ alignSelf: "flex-end" }}>
              <MapView
                initialRegion={{
                  latitude: reqCoord.latitude,
                  longitude: reqCoord.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                style={styles.map}
              >
                <Marker
                  title={res.facility}
                  coordinate={{ latitude: reqCoord.latitude, longitude: reqCoord.longitude }}
                />
              </MapView>
            </TouchableHighlight>
          </View>
        </View>
      </CollapsibleView>
    );
  };

  // Preview Component *************************

  // Icon Component ****************************

  const handlePress = (key) => {
    if (activeIconIndex.length > 8 && activeIconIndex.includes(key) === false) {
      Alert.alert("You may only select up to 8 icons");
      return;
    }

    if (activeIconIndex.includes(key) === false) {
      setActiveIconIndex([...activeIconIndex, key]);
    }
    if (activeIconIndex.includes(key)) {
      let copyArr = [...activeIconIndex];
      let index = copyArr.indexOf(key);
      copyArr.splice(index, 1);
      setActiveIconIndex(copyArr);
    }
  };

  const iconSelect = () => {
    let i = -1;
    return iconBank.map((icon) => {
      i = i + 1;
      let ci = i;
      return (
        <TouchableOpacity
          value={i}
          key={i}
          style={activeIconIndex.includes(ci) ? styles.selectedIcon : styles.selectIcon}
          onPress={() => handlePress(ci)}
        >
          <Icon name={iconBank[i].name} type={iconBank[i].family} size={RFValue(36)} color="black" />
        </TouchableOpacity>
      );
    });
  };

  // Icon Component ****************************

  const onChangeCapacity = (number) => setReqCurrentCapacity(number);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {dataLoaded && (
        <View style={styles.inputWrapper}>
          <TextInput mode="outlined" style={styles.input} label="Facility" value={res.facility} />
          <TextInput mode="outlined" style={styles.input} label="Address" value={res.facility_address} />
          <View style={styles.capacityInput}>
            <TextInput
              mode="outlined"
              style={[styles.inputNumber, { alignSelf: "center" }]}
              label="Max Capacity"
              value={String(reqMaxCapacity)}
              onChangeText={(number) => setReqMaxCapacity(number)}
            />
            <View style={styles.rowFlex}>
              <TextInput
                mode="outlined"
                style={styles.inputNumber}
                label="Current Capacity"
                value={String(reqCurrentCapacity)}
                onChangeText={(number) => onChangeCapacity(number)}
              />
              <TouchableHighlight onPressIn={increaseCounter} underlayColor="#DDDDDD">
                <Icon type="antdesign" name="pluscircleo" size={45} color="green" />
              </TouchableHighlight>
              <TouchableHighlight onPressIn={decreaseCounter} underlayColor="#DDDDDD">
                <Icon type="antdesign" name="minuscircleo" size={45} color="red" />
              </TouchableHighlight>
            </View>
            <TextInput
              mode="outlined"
              style={styles.input}
              label="Message"
              value={reqMsg}
              onChangeText={(text) => setReqMsg(text)}
            />
            <TextInput
              mode="outlined"
              style={styles.input}
              label="Img URL"
              value={reqImage}
              onChangeText={(text) => setReqImage(text)}
            />
          </View>
        </View>
      )}
      {dataLoaded && <View style={styles.iconBoard}>{iconSelect()}</View>}

      <Text style={{ fontSize: 20, textAlign: "center" }}>Preview:</Text>
      {dataLoaded && coordLoaded && previewRow()}
      <Button style={{ marginTop: 20 }} title="Update" onPress={update} />

      <StatusBar style="light" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    alignItems: "center",
  },
  inputWrapper: { width: "100%", marginTop: "5%" },
  capacityInput: { marginTop: 20, marginBottom: 20 },
  input: {
    height: 50,
    width: 300,
    fontSize: 15,
    marginBottom: 10,
    alignSelf: "center",
  },
  inputNumber: {
    height: 50,
    width: 200,
    fontSize: 15,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 25,
  },
  iconBoard: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "80%",
    aspectRatio: 1,
    borderWidth: 1,
    marginBottom: 20,
    justifyContent: "center",
  },
  selectIcon: {
    borderWidth: 1,
    borderColor: "white",
    margin: 2,
  },
  selectedIcon: {
    borderWidth: 1,
    margin: 2,
  },
  rowFlex: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  rowEntry: {
    width: "98%",
    alignItems: "flex-start",
    marginBottom: 40,
    borderWidth: 1,
  },
  rowTitle: {
    width: "96%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowText: {
    fontSize: 16,
    textAlign: "center",
  },
  icon: {
    marginHorizontal: 2,
  },
  rowEntryExtra: {
    marginTop: 5,
    height: 200,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
  },

  tinyLogo: {
    width: 50,
    height: 50,
    marginLeft: 5,
    marginRight: 10,
  },

  map: {
    width: 200,
    height: 200,
    zIndex: 10000,
    alignSelf: "center",
  },
});
