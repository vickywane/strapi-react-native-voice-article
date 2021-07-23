import * as React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { useMutation } from "@apollo/client";
import { CREATE_RECORDING, UPLOAD_FILE } from "../graphql";
import { getItem, USER_ID_KEY } from "../storage";

const { width, height } = Dimensions.get("screen");

const CreateRecording = ({ navigation }) => {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [canRecord, setRecordStatus] = React.useState(false);
  const [record, setRecord] = React.useState(null);

  const [uploadFile, { data }] = useMutation(UPLOAD_FILE);
  const [createRecording, { error }] = useMutation(CREATE_RECORDING);

  const startRecording = async () => {
    setRecordStatus(!canRecord);

    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording...");
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecord(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const submitRecording = async () => {
    await record.stopAndUnloadAsync();
    const uri = record.getURI();

    const recordingFile = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    try {
      await uploadFile({
        variables: {
          file: recordingFile,
        },
      });

      const userId = await getItem(USER_ID_KEY);
      await createRecording({
        variables: {
          name,
          fileId: data.id,
          description,
          userId,
        },
      });

      navigation.navigate("home");
    } catch (e) {
      console.log(e);
    } finally {
      setRecordStatus(!canRecord);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.alignCenter}>
        <Text> {error} </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.title}> Recording Name </Text>
          <View style={styles.input}>
            <TextInput
              value={name}
              placeholder="A name for the recording"
              onChangeText={(value) => setName(value)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.title}> Recording Description </Text>
          <View style={styles.input}>
            <TextInput
              value={description}
              placeholder="A description of your recording"
              onChangeText={(value) => setDescription(value)}
            />
          </View>
        </View>

        <View style={{ marginVertical: 10 }} />

        <TouchableOpacity
          disabled={!name.length > 2 && description.length > 2}
          onPress={() => {
            if (!canRecord) {
              startRecording();
            } else {
              submitRecording();
            }
          }}
          style={[
            styles.button,
            styles.alignCenter,
            {
              backgroundColor: canRecord ? "red" : "#8c4bff",
              borderColor: canRecord ? "red" : "#8c4bff",
            },
          ]}
        >
          {!canRecord ? (
            <Text style={{ color: "#fff", fontSize: 15 }}>
              Save and Start Recording
            </Text>
          ) : (
            <Text style={{ color: "#fff", fontSize: 15 }}>Stop Recording</Text>
          )}
        </TouchableOpacity>

        <View style={[styles.iconContainer, styles.alignCenter]}>
          {canRecord ? (
            <View>
              <Icon name={"ios-mic-outline"} size={85} />
            </View>
          ) : (
            <Icon
              name={"md-mic-off-circle-outline"}
              color={"#c0c0c0"}
              size={85}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    paddingBottom: 8,
  },
  root: {
    backgroundColor: "#fff",
    height,
  },
  input: {
    backgroundColor: "#fff",
    paddingLeft: 10,
    borderWidth: 0.7,
    borderColor: "#c0c0c0",
    height: 50,
    borderRadius: 4,
    marginBottom: 5,
    width: width - 25,
  },
  inputContainer: {
    marginTop: 10,
    width: width - 25,
  },
  alignCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderColor: "#8c4bff",
    backgroundColor: "#8c4bff",
    height: 47,
    width: width - 25,
    borderWidth: 1,
    color: "#fff",
    fontSize: 16,
    borderRadius: 5,
  },
  iconContainer: {
    height: 350,
  },
});

export default CreateRecording;
