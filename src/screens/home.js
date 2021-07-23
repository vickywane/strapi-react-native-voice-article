import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@apollo/client";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import RecordingCard from "../components/recordingCard";

import { clearItem, getItem, USER_TOKEN_KEY } from "../storage";
import { FETCH_RECORDINGS } from "../graphql";

const { width } = Dimensions.get("screen");

const handleLogout = async (navigation) => {
  try {
    await clearItem(USER_TOKEN_KEY);

    navigation.navigate("login");
  } catch (e) {
    console.log(e);
  }
};

const Home = ({ navigation }) => {
  useEffect(() => {
    (async function () {
      const token = await getItem(USER_TOKEN_KEY);
      if (!token) {
        navigation.navigate("login");
      }

      navigation.setOptions({
        headerRight: () => {
          return (
            <View style={{ paddingRight: 15 }}>
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => handleLogout(navigation)}
              >
                <MaterialIcons name={"logout"} color={"#fff"} size={20} />
              </TouchableOpacity>
            </View>
          );
        },
      });
    })();
  }, []);

  const { data, error, loading } = useQuery(FETCH_RECORDINGS);

  if (loading) {
    return (
      <View style={styles.alignCenter}>
        <ActivityIndicator color="#8c4bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.alignCenter, { paddingTop: 15 }]}>
        <Text> An error occurred while loading your recordings... </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        data={data.voiceRecordings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecordingCard onPlay={() => playAudio()} data={item} />
        )}
        ListEmptyComponent={() => (
          <View>
            <Text style={{ textAlign: "center", fontSize: 16 }}>
              {`\n You don't have any recordings. \n Tap the button below to create your first recording.`}
            </Text>
          </View>
        )}
      />

      <View style={styles.alignCenter}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CreateRecording", {
              userId: data.voiceRecordings[0].id,
            })
          }
          style={styles.button}
        >
          <Icon name={"ios-add"} color={"#fff"} size={20} />
          <Text style={{ color: "#fff" }}> Create New Recording </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alignCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderColor: "#8c4bff",
    backgroundColor: "#8c4bff",
    height: 47,
    width: width - 25,
    borderWidth: 1,
    color: "#fff",
    fontSize: 16,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default Home;
