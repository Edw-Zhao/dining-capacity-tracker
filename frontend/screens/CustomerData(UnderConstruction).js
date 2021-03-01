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
  Card,
} from "react-native";
import baseURL from "../assets/common/baseURL";
import axios from "axios";
import CollapsibleView from "@eliav2/react-native-collapsible-view";
import MapView, { Marker } from "react-native-maps";
import iconBank from "../components/iconbank";
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import DropDownPicker from "react-native-dropdown-picker";

export default function CustomerData({ navigation }) {
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
      console.log([rawFilterInput, townFilterInput, filterIcon, filterCounter]);
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
      if (iconBank[key].family === "FontAwesome5") {
        return <FontAwesome5 style={styles.icon} key={key} name={iconBank[key].name} size={22} />;
      }
      if (iconBank[key].family === "Ionicons") {
        return <Ionicons style={styles.icon} key={key} name={iconBank[key].name} size={22} />;
      }
      if (iconBank[key].family === "MaterialCommunityIcons") {
        return <MaterialCommunityIcons style={styles.icon} key={key} name={iconBank[key].name} size={22} />;
      }
    });
  };
  const capaFrac = (entry) => {
    return (
      <Text style={styles.rowText}>
        {String(Math.round((entry.current_capacity / entry.max_capacity) * 1000) / 10) + "%"}
      </Text>
    );
  };

  const entryRow = (entry, i) => {
    return (
      <CollapsibleView
        key={i}
        style={styles.rowEntry}
        title={
          <View style={styles.rowTitle}>
            <Image source={{ uri: entry.img_src }} style={styles.tinyLogo} />
            <View style={{ alignSelf: "center" }}>
              <Text style={styles.rowText}>{String(entry.facility)}</Text>
              <View style={[styles.rowFlex, { justifyContent: "space-around" }]}>{showIcons(entry)}</View>
            </View>
            <View>{capaFrac(entry)}</View>
          </View>
        }
      >
        <View style={styles.rowEntryExtra}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <Text style={{ marginBottom: 20, marginTop: 20, fontSize: RFValue(17) }}> {entry.msg} </Text>
              <Text style={styles.desc}>Type: {entry.permit_type}</Text>
              <Text style={styles.desc}>City: {entry.facility_town}</Text>
              <Text style={styles.desc}>Address: {entry.facility_address}</Text>
              <Text style={styles.desc}>Max Capacity: {entry.max_capacity}</Text>
              <Text style={styles.desc}>Current Capacity: {entry.current_capacity}</Text>
            </View>
            <TouchableHighlight style={{ alignSelf: "flex-end" }}>
              <MapView
                initialRegion={{
                  latitude: entry.location_latitude,
                  longitude: entry.location_longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                style={styles.map}
              >
                <Marker
                  title={entry.facility}
                  coordinate={{ latitude: entry.location_latitude, longitude: entry.location_longitude }}
                />
              </MapView>
            </TouchableHighlight>
          </View>
        </View>
      </CollapsibleView>
    );
  };

  // > Functions for entries **************************************

  const displayAllData = () => {
    return res.map((entry, i) => {
      return entryRow(entry, i);
    });
  };

  const displayAllData = () => {
    return (
      <FlatList
        data={res}
        horizontal={false}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity>
              <Text>{String(item.facility)}</Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  const displayFilteredData = () => {
    return filteredList.map((entry, i) => {
      return entryRow(entry, i);
    });
  };

  // < Filter *********************************************

  let localArrList = [];
  iconBank.map((icon, i) => {
    localArrList.push({
      label: icon.name,
      value: icon.name,
      key: i,
      icon: () => {
        if (icon.family === "MaterialCommunityIcons") {
          return <MaterialCommunityIcons name={icon.name} size={28} />;
        }
        if (icon.family === "Ionicons") {
          return <Ionicons name={icon.name} size={30} />;
        }
        if (icon.family === "FontAwesome5") {
          return <FontAwesome5 name={icon.name} size={30} />;
        }
      },
    });
  });
  localArrList.push({ label: "None", value: "None" });

  return (
    <View style={styles.container}>
      <View style={{ width: "100%" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 15 }}>
          <TextInput
            style={styles.input}
            mode="outlined"
            label="Filter by name"
            onChangeText={(text) => {
              setRawFilterInput(text);
            }}
          />
          <View style={{ width: "45%", alignItems: "center" }}>
            <DropDownPicker
              placeholder="Filter by city"
              style={{ width: "100%" }}
              containerStyle={{ height: 40 }}
              items={[
                { label: "Bedford", value: "Bedford" },
                { label: "Halifax", value: "Halifax" },
              ]}
              itemStyle={{
                justifyContent: "flex-start",
              }}
              dropDownStyle={{ backgroundColor: "#fafafa" }}
              onChangeItem={(option) => setTownFilterInput(option.label)}
            />
            <DropDownPicker
              placeholder="Filter by tag"
              label="yeet"
              style={{ width: "100%" }}
              containerStyle={{ height: 40 }}
              items={localArrList}
              itemStyle={{
                justifyContent: "flex-start",
              }}
              dropDownStyle={{ backgroundColor: "#fafafa" }}
              onChangeItem={(option) => setFilterIcon(option.key)}
            />
          </View>
        </View>
        {!dataLoaded && <Text>Loading...</Text>}
        {dataLoaded && filterCounter === 0 && displayAllData()}
        {filterCounter > 0 && (
          <ScrollView contentContainerStyle={styles.containerScroll}>{displayFilteredData()}</ScrollView>
        )}
      </View>
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingTop: 20,
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  containerScroll: {
    backgroundColor: "#fff",
    width: "100%",
    alignItems: "center",
  },
  button: {
    color: "black",
    borderWidth: 1,
    padding: 5,
    fontSize: RFValue(15),
  },
  input: {
    height: 50,
    width: "45%",
    fontSize: RFValue(15),
    marginBottom: 10,
    alignSelf: "center",
  },
  desc: {
    fontSize: RFValue(11),
  },
  rowEntry: {
    width: "90%",
    alignItems: "flex-start",
  },
  rowTitle: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    marginHorizontal: 2,
  },
  rowText: {
    fontSize: RFValue(12),
    textAlign: "center",
  },
  rowFlex: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  rowEntryExtra: {
    marginTop: 5,
    height: 200,
    borderWidth: 1,
    color: "purple",
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
