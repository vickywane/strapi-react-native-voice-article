import * as React from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useMutation } from "@apollo/client";
import { CREATE_ACCOUNT } from "../graphql";

const { height, width } = Dimensions.get("window");

const CreateAccount = (props) => {
  const [Email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [Password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState(null);

  const [isLoading, setLoading] = React.useState(false);

  const [createAccount, { data }] = useMutation(CREATE_ACCOUNT, {
    variables: {
      username,
      email: Email,
      password: Password,
    },
  });

  const handleCreateAccount = async () => {
    setLoading(true);
    try {
      await createAccount();

      if (data) {
        props.navigation.navigate("login");
      }
    } catch (e) {
      console.log(`error creating account : ${e}`);

      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.body}>
      <View>
        <Text style={[styles.title, styles.alignCenter]}>
          {" "}
          Strapi Voice Recorder
        </Text>
        <View style={{ marginVertical: 5 }} />
        <Text style={{ textAlign: "center", fontSize: 15 }}>
          {" "}
          {`Voice recorder application  powered \n by Strapi CMS API`}{" "}
        </Text>
        <View style={{ marginVertical: 15 }} />

        {error && (
          <Text style={{ textAlign: "center", fontSize: 14, color: "red" }}>
            {" "}
            {error.message}{" "}
          </Text>
        )}

        <View style={styles.input}>
          <TextInput
            keyboardType="text"
            value={username}
            placeholder="Your username. e.g Johnny"
            onChangeText={(val) => setUsername(val)}
          />
        </View>
        <View style={{ marginVertical: 10 }} />

        <View style={styles.input}>
          <TextInput
            keyboardType="email-address"
            value={Email}
            placeholder="Your email. John@mail.com"
            onChangeText={(val) => setEmail(val)}
          />
        </View>
        <View style={{ marginVertical: 10 }} />
        <View style={styles.input}>
          <TextInput
            secureTextEntry={true}
            value={Password}
            placeholder="Your Password"
            onChangeText={(val) => setPassword(val)}
          />
        </View>
        <View style={{ marginVertical: 10 }} />
        <View style={styles.input}>
          <TextInput
            secureTextEntry={true}
            value={confirmPassword}
            placeholder="Confirm Your Password"
            onChangeText={(val) => setConfirmPassword(val)}
          />
        </View>
        <View style={{ marginVertical: 10 }} />

        <View style={styles.alignCenter}>
          <TouchableOpacity
            disabled={Password !== confirmPassword}
            onPress={() => handleCreateAccount()}
            style={[styles.button, styles.alignCenter]}
          >
            {!isLoading ? (
              <Text style={{ color: "#fff" }}> Create New Account </Text>
            ) : (
              <ActivityIndicator color="#282c34" />
            )}
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical: 10 }} />

        <TouchableOpacity
          disabled={isLoading}
          onPress={() => props.navigation.navigate("login")}
        >
          <View style={styles.flex}>
            <Text style={styles.infoText}>Have An Account?</Text>

            <Text style={[styles.infoText, { color: "black", marginLeft: 10 }]}>
              Login Instead
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "500",
  },

  infoText: {
    textAlign: "center",
    fontSize: 14,
    color: "grey",
  },

  body: {
    backgroundColor: "#fff",
    height,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#c0c0c0",
    height: 45,
    width: width - 30,
  },
  alignCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    height: 40,
    borderWidth: 1,
    borderColor: "#28BFFD",
    backgroundColor: "#28BFFD",
    color: "#fff",
    width: width - 30,
    fontSize: 16,
    borderRadius: 3,
  },
});

export default CreateAccount;
