import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Button,
  TextInput,
  Modal,
} from "react-native";
import baseURL from "../assets/common/baseURL";
import axios from "axios";
import MapView, { Marker } from "react-native-maps";
import iconBank from "../components/iconbank";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as Progress from "react-native-progress";
import { Icon } from "react-native-elements";

export default function CustomerData({ navigation }) {
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;

  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.allowFontScaling = false;

  const [res, setRes] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [location, setLocation] = useState(null);
  const [showAllData, setShowAllData] = useState(false);
  const [showFilterSection, setShowFilterSection] = useState(false);
  const [rawFilterInput, setRawFilterInput] = useState("");
  const [townFilterInput, setTownFilterInput] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [filterCounter, setFilterCounter] = useState(0);
  const [filterIcon, setFilterIcon] = useState(1000);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Get Backend Data
      await axios.get(`${baseURL}restaurants`).then((res) => {
        setRes(res.data);
        setDataLoaded(true);
      });
    };
    fetchData();
  }, []);

  // < Filter after changes *****************************************

  useEffect(() => {
    const correctCond = (entry, alreadypushed, localfilteredList) => {
      localfilteredList.push(entry);
      return (alreadypushed = true);
    };

    if (dataLoaded) {
      let localfilteredList = [];
      let inputregex = rawFilterInput.split(" ");

      res.forEach((entry) => {
        let entryregex = entry.facility.split(" ");
        let alreadypushed = false;

        if (
          inputregex[0] !== "" &&
          entry.facility_town === townFilterInput.toUpperCase() &&
          entry.icon_arr.includes(filterIcon) &&
          !alreadypushed
        ) {
          inputregex.forEach((inputword) => {
            if (entryregex.includes(inputword.toUpperCase()) && !alreadypushed) {
              alreadypushed = correctCond(entry, alreadypushed, localfilteredList);
            }
          });
        } else if (
          inputregex[0] !== "" &&
          entry.facility_town === townFilterInput.toUpperCase() &&
          filterIcon > 999 &&
          !alreadypushed
        ) {
          inputregex.forEach((inputword) => {
            if (entryregex.includes(inputword.toUpperCase()) && !alreadypushed) {
              alreadypushed = correctCond(entry, alreadypushed, localfilteredList);
            }
          });
        } else if (inputregex[0] !== "" && entry.icon_arr.includes(filterIcon) && !alreadypushed) {
          inputregex.forEach((inputword) => {
            if (entryregex.includes(inputword.toUpperCase()) && !alreadypushed) {
              alreadypushed = correctCond(entry, alreadypushed, localfilteredList);
            }
          });
        } else if (
          inputregex[0] === "" &&
          entry.facility_town === townFilterInput.toUpperCase() &&
          entry.icon_arr.includes(filterIcon) &&
          !alreadypushed
        ) {
          alreadypushed = correctCond(entry, alreadypushed, localfilteredList);
        } else if (inputregex[0] !== "" && filterIcon > 999 && townFilterInput === "" && !alreadypushed) {
          inputregex.forEach((inputword) => {
            if (entryregex.includes(inputword.toUpperCase()) && !alreadypushed) {
              alreadypushed = correctCond(entry, alreadypushed, localfilteredList);
            }
          });
        } else if (
          entry.facility_town === townFilterInput.toUpperCase() &&
          inputregex[0] === "" &&
          filterIcon > 999 &&
          !alreadypushed
        ) {
          correctCond(entry, alreadypushed, localfilteredList);
        } else if (
          entry.icon_arr.includes(filterIcon) &&
          inputregex[0] === "" &&
          townFilterInput === "" &&
          !alreadypushed
        ) {
          correctCond(entry, alreadypushed, localfilteredList);
        }
      });
      setFilterCounter(filterCounter + 1);
      setFilteredList(localfilteredList);
    }
  }, [rawFilterInput, townFilterInput, filterIcon]);

  // > Filter after changes *****************************************

  // < Functions for entries **************************************

  const showIcons = (entry) => {
    return entry.icon_arr.map((key) => {
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

  const capaFrac = (entry) => {
    return (
      <Text style={styles.rowText}>
        {String(Math.round((entry.current_capacity / entry.max_capacity) * 1000) / 10) + "%"}
      </Text>
    );
  };

  const capacityPercent = (entry) => {
    return entry.current_capacity / entry.max_capacity;
  };

  // > Functions for entries **************************************

  const displayData = (dataArr) => {
    return (
      <FlatList
        contentContainerStyle={{ marginTop: "2%", alignItems: "center" }}
        data={dataArr}
        horizontal={false}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.itemEntry}
              onPress={() => navigation.navigate("Customer Restaurant Screen", { restaurant: item })}
            >
              <Progress.Bar
                progress={capacityPercent(item)}
                backgroundColor="white"
                borderWidth={1.5}
                borderColor="lightgrey"
                color={
                  capacityPercent(item) >= 0 && capacityPercent(item) < 0.6
                    ? "rgb(124,252,0)"
                    : capacityPercent(item) >= 0.6 && capacityPercent(item) < 0.8
                    ? "yellow"
                    : "red"
                }
                borderRadius={1}
                style={{ width: "100%" }}
              ></Progress.Bar>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  {String(item.facility)}
                </Text>
                {/*<Text numberOfLines={1} style={{ color: "black", fontSize: RFValue(8.5) }}>
                  {String(item.facility_address)}
                </Text> */}
              </View>
              <Image style={styles.restaurantPicture} source={{ uri: item.img_src }} />
              <View style={{ flexDirection: "row", marginTop: 5, minHeight: 13 }}>{showIcons(item)}</View>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  // < Filter *********************************************

  const filterIconRows = () => {
    return iconBank.map((icon, i) => {
      let ci = i;
      return (
        <TouchableOpacity
          style={[styles.filterRow, { flexDirection: "row" }]}
          key={ci}
          onPress={(i) => {
            setFilterIcon(ci);
            setShowTagModal(!setShowTagModal);
          }}
        >
          <Icon name={iconBank[ci].name} type={iconBank[ci].family} size={30} color="black" />
          <Text style={{ fontSize: RFValue(22) }}> {icon.name}</Text>
        </TouchableOpacity>
      );
    });
  };

  let cityArrList = ["Halifax", "Bedford", "Dartmouth", "Sackville", "Cole Harbour"];

  let filterCityRows = () => {
    return cityArrList.map((city, i) => {
      return (
        <TouchableOpacity
          style={styles.filterRow}
          key={i}
          onPress={() => {
            setTownFilterInput(city);
            setShowCityModal(!setShowCityModal);
          }}
        >
          <Text style={{ fontSize: RFValue(22) }}>{city}</Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterHeader}>
        <TextInput
          style={styles.nameInput}
          mode="outlined"
          placeholder="Filter by name"
          onChangeText={(text) => {
            setRawFilterInput(text);
          }}
        />
        <TouchableOpacity
          onPress={() => setShowCityModal(true)}
          style={{ width: "30%", alignSelf: "center", justifyContent: "center" }}
        >
          <View style={styles.filterModalBtn}>
            {townFilterInput !== "" ? (
              <Text style={{ color: "black" }}>{townFilterInput}</Text>
            ) : (
              <Text style={{ color: "grey" }}>Filter by city</Text>
            )}
          </View>
        </TouchableOpacity>

        <Modal animationType="fade" visible={showCityModal} transparent={true}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={{ alignSelf: "flex-end", padding: 5 }}
                onPress={() => setShowCityModal(!setShowCityModal)}
              >
                <Icon name="exit-outline" type="ionicon" size={24} color="black" />
              </TouchableOpacity>
              <ScrollView style={{ width: "100%" }} contentContainerStyle={{ width: "100%", alignItems: "center" }}>
                {filterCityRows()}
              </ScrollView>
              <View style={{ height: 25 }}></View>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          onPress={() => setShowTagModal(true)}
          style={{ width: "30%", alignSelf: "center", justifyContent: "center" }}
        >
          <View style={styles.filterModalBtn}>
            {filterIcon < 1000 ? (
              <Icon
                name={iconBank[filterIcon].name}
                style={styles.icon}
                type={iconBank[filterIcon].family}
                size={RFValue(24)}
                color="black"
              />
            ) : (
              <Text style={styles.filterModalBtn}>Filter by tag</Text>
            )}
          </View>
        </TouchableOpacity>

        <Modal animationType="fade" visible={showTagModal} transparent={true}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={{ alignSelf: "flex-end", padding: 5 }}
                onPress={() => setShowTagModal(!setShowTagModal)}
              >
                <Icon name="exit-outline" type="ionicon" size={24} color="black" />
              </TouchableOpacity>
              <ScrollView style={{ width: "100%" }} contentContainerStyle={{ width: "100%", alignItems: "center" }}>
                {filterIconRows()}
              </ScrollView>
              <View style={{ height: 25 }}></View>
            </View>
          </View>
        </Modal>
      </View>
      <ImageBackground
        style={{ height: "100%", width: "100%" }}
        source={require("../assets/background/hand-drawn-food-kitchen-utensils-seamless-pattern-doodle-style_75047-119.jpg")}
        blurRadius={0}
      >
        {!dataLoaded && <Text>Loading...</Text>}
        {dataLoaded && filterCounter === 0 && displayData(res)}
        {filterCounter > 0 && displayData(filteredList)}
      </ImageBackground>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  filterHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: "2%",
    backgroundColor: "lightgrey",
  },
  filterModalBtn: {
    height: 30,
    shadowRadius: 2,
    borderRadius: 4,
    backgroundColor: "white",
    borderColor: "lightgrey",
    color: "grey",
    textAlign: "center",
    textAlignVertical: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    opacity: 0.95,
    height: "65%",
    width: "83.5%",
    backgroundColor: "grey",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    elevation: 5,
  },
  filterRow: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "lightgrey",
    width: "80%",
    marginVertical: "0.5%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
  },
  button: {
    color: "black",
    borderWidth: 1,
    padding: 5,
    fontSize: RFValue(15),
  },
  nameInput: {
    height: 30,
    width: "30%",
    fontSize: RFValue(14),
    shadowRadius: 2,
    borderRadius: 4,
    backgroundColor: "white",
    borderColor: "lightgrey",
    color: "black",
    paddingLeft: 15,
  },
  itemEntry: {
    borderRadius: 5,
    width: 150,
    marginVertical: 10,
    marginHorizontal: 22,
    padding: 5,
    backgroundColor: "white",
    alignItems: "center",
  },
  desc: {
    fontSize: RFValue(11),
  },
  restaurantPicture: {
    width: "100%",
    aspectRatio: 1.3,
  },
  icon: {
    marginHorizontal: 1,
  },
  rowFlex: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
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
  },
});
