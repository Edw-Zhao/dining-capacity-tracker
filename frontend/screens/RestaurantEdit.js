import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
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
import iconBank from "../components/iconbank";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Icon, Button } from "react-native-elements";
import * as Progress from "react-native-progress";

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
  const [permission, setPermission] = useState(false);

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
          setReqMaxCapacity(1);
          setReqCurrentCapacity(0);
          setReqImage(
            "https://media.istockphoto.com/vectors/spoon-fork-and-knife-illustration-set-vector-id1214861636?b=1&k=6&m=1214861636&s=612x612&w=0&h=qGrshVBL1XQDDQnirOKWcJeksyMnAGu6dc-VugCzNXM="
          );
        }
        setDataLoaded(true);
      });
    };
    fetchData();
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status === "granted") {
        setPermission(true);
      }
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }
    })();
  }, []);

  useEffect(() => {
    if (dataLoaded && res.registered === false && permission === true) {
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

  const showIcons = (entry) => {
    return activeIconIndex.map((key) => {
      return (
        <Icon
          key={key}
          name={iconBank[key].name}
          style={styles.icon}
          type={iconBank[key].family}
          size={RFValue(12)}
          color="black"
        />
      );
    });
  };

  const capacityPercent = () => {
    return reqCurrentCapacity / reqMaxCapacity;
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

  const onChangeCapacity = (number) => setReqCurrentCapacity(Number(number));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        style={{ height: "100%", width: "100%" }}
        source={require("../assets/background/foodtilebackground.jpg")}
        blurRadius={0}
      >
        {dataLoaded && (
          <View>
            <View style={styles.inputWrapper}>
              <Text style={styles.sectionHeader}>Account / Restaurant Details</Text>
              <View style={[styles.rowFlex, { marginTop: 5 }]}>
                <Text style={styles.accountDetailsType} numberOfLines={1}>
                  Facility:
                </Text>
                <View>
                  <Text style={[styles.accountDetails, { fontWeight: "bold" }]} numberOfLines={1}>
                    {res.facility}
                  </Text>
                </View>
              </View>
              <View style={styles.rowFlex}>
                <Text style={styles.accountDetailsType} numberOfLines={1}>
                  Permit Type:
                </Text>
                <Text style={[styles.accountDetails, { fontWeight: "bold" }]} numberOfLines={1}>
                  {res.permit_type}
                </Text>
              </View>
              <View style={styles.rowFlex}>
                <Text style={styles.accountDetailsType} numberOfLines={1}>
                  Permit Status:
                </Text>
                <Text style={[styles.accountDetails, { fontWeight: "bold" }]} numberOfLines={1}>
                  {res.permit_status}
                </Text>
              </View>
              <View style={styles.rowFlex}>
                <Text style={styles.accountDetailsType} numberOfLines={1}>
                  Facility Town:
                </Text>
                <Text style={[styles.accountDetails, { fontWeight: "bold" }]} numberOfLines={1}>
                  {res.facility_town}
                </Text>
              </View>
              <View style={styles.rowFlex}>
                <Text style={styles.accountDetailsType} numberOfLines={1}>
                  Facility Address:
                </Text>
                <Text style={[styles.accountDetails, { fontWeight: "bold" }]} numberOfLines={1}>
                  {res.facility_address}
                </Text>
              </View>
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.sectionHeader}>Update Details</Text>
              <View style={styles.capacityInput}>
                <TextInput
                  mode="outlined"
                  style={[styles.inputNumber, { alignSelf: "center" }]}
                  label="Max Capacity"
                  value={String(reqMaxCapacity)}
                  onChangeText={(number) => {
                    if (number > 0) {
                      setReqMaxCapacity(number);
                    }
                  }}
                />
                <View style={[styles.rowFlex]}>
                  <TextInput
                    mode="outlined"
                    style={[styles.inputNumber, { width: "64%" }]}
                    label="Current Capacity"
                    value={String(reqCurrentCapacity)}
                    onChangeText={(number) => onChangeCapacity(number)}
                    underlineColor="black"
                  />

                  <TouchableHighlight
                    onPressIn={increaseCounter}
                    underlayColor="#DDDDDD"
                    style={{ marginBottom: 4, marginLeft: 4 }}
                  >
                    <Icon type="antdesign" name="plussquare" size={45} color="green" />
                  </TouchableHighlight>
                  <TouchableHighlight onPressIn={decreaseCounter} underlayColor="#DDDDDD" style={{ marginBottom: 4 }}>
                    <Icon type="antdesign" name="minussquare" size={45} color="red" />
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
                  style={[styles.input, { marginBottom: 20 }]}
                  label="Img URL"
                  value={reqImage}
                  onChangeText={(text) => setReqImage(text)}
                />
              </View>
              {dataLoaded && <View style={styles.iconBoard}>{iconSelect()}</View>}
            </View>
          </View>
        )}
        {dataLoaded && coordLoaded && (
          <View style={[styles.inputWrapper, { marginBottom: 20 }]}>
            <Text style={styles.sectionHeader}>Preview:</Text>
            <Text style={{ marginTop: 5 }}>Press to see your restaurant page</Text>
            <TouchableOpacity
              style={[styles.itemEntry]}
              onPress={() =>
                navigation.navigate("Preview Restaurant Screen", {
                  restaurant: res,
                  current_capacity: reqCurrentCapacity,
                  max_capacity: reqMaxCapacity,
                  coordinates: reqCoord,
                  img_src: reqImage,
                  icon_arr: activeIconIndex,
                  msg: reqMsg,
                })
              }
            >
              <Progress.Bar
                progress={capacityPercent(res)}
                backgroundColor="white"
                borderWidth={1.5}
                borderColor="lightgrey"
                color={
                  capacityPercent(res) >= 0 && capacityPercent(res) < 0.6
                    ? "rgb(124,252,0)"
                    : capacityPercent(res) >= 0.6 && capacityPercent(res) < 0.8
                    ? "yellow"
                    : "red"
                }
                borderRadius={1}
                style={{ width: "100%" }}
              ></Progress.Bar>
              <View style={{}}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  {String(res.facility)}
                </Text>
              </View>
              <Image style={styles.restaurantPicture} source={{ uri: reqImage }} />
              <View style={{ flexDirection: "row", marginTop: 5, minHeight: 13 }}>{showIcons()}</View>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={{ alignSelf: "center", marginBottom: 20 }} onPress={update}>
          <Text style={styles.button}>Update</Text>
        </TouchableOpacity>
      </ImageBackground>
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
  inputWrapper: {
    width: "80%",
    marginTop: "5%",
    backgroundColor: "white",
    opacity: 0.9,
    alignSelf: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 4,
    borderColor: "rgb(98,0,238)",
    paddingBottom: 10,
  },
  sectionHeader: {
    height: 30,
    width: "80%",
    borderBottomWidth: 1,
    borderColor: "rgb(98,0,238)",
    fontWeight: "bold",
    padding: 2,
    fontSize: RFValue(18),
    color: "rgb(98,0,238)",
    textAlign: "center",
    textAlignVertical: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  accountDetailsType: {
    height: 25,
    borderColor: "lightgrey",
    padding: 2,
    color: "black",
    textAlignVertical: "center",
    fontSize: RFValue(12),
    width: 110,
  },
  accountDetails: {
    height: 25,
    borderColor: "lightgrey",
    padding: 2,
    color: "black",
    textAlignVertical: "center",
    fontSize: RFValue(12),
    width: 150,
  },
  capacityInput: {
    marginTop: 20,
    width: "80%",
  },
  input: {
    height: 40,
    width: "100%",
    fontSize: 15,
    marginBottom: 10,
    alignSelf: "center",
  },
  inputNumber: {
    height: 40,
    width: "100%",
    fontSize: 15,
    textAlign: "center",
    fontSize: 25,
    alignSelf: "center",
    color: "black",
    marginBottom: 10,
    textAlignVertical: "center",
  },
  iconBoard: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "80%",
    borderWidth: 1,
    borderColor: "rgb(98,0,238)",
    marginBottom: 20,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "white",
  },
  selectIcon: {
    borderWidth: 1.5,
    borderColor: "white",
    margin: 2,
  },
  selectedIcon: {
    borderWidth: 1.5,
    borderColor: "rgb(98,0,238)",
    margin: 2,
  },
  rowFlex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  itemEntry: {
    borderRadius: 5,
    width: 150,
    marginVertical: 10,
    marginHorizontal: 22,
    padding: 5,
    backgroundColor: "white",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "grey",
  },
  restaurantPicture: {
    width: "100%",
    aspectRatio: 1.3,
  },
  icon: {
    marginHorizontal: 2,
  },
  button: {
    color: "white",
    borderRadius: 4,
    backgroundColor: "rgb(98,0,238)",
    padding: 10,
    width: 100,
    fontSize: RFValue(20),
    fontWeight: "900",
    textAlign: "center",
    textAlignVertical: "center",
  },
});
