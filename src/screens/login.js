import * as React from "react";
import { useMutation } from "@apollo/client";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { setItem, getItem, USER_TOKEN_KEY } from "../storage";
import { LOGIN_USER } from "../graphql";

const { height, width } = Dimensions.get("window");

const Login = (props) => {
  const [Email, setEmail] = React.useState("");
  const [Password, setPassword] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const [error, setLoginError] = React.useState(null);

  const [loginUser, { data }] = useMutation(LOGIN_USER);

  React.useEffect(() => {
    (async function () {
      const token = await getItem(USER_TOKEN_KEY);
      if (token) {
        props.navigation.navigate("home");
      }
    })();
  }, []);

  const handleLogin = async () => {
    setLoading(true);

    try {
      await loginUser({
        variables: {
          email: Email,
          password: Password,
        },
      });

      if (data) {
        await setItem(data.login.jwt);
        await setItem(data.login.user.id)

        props.navigation.navigate("home");
      }
    } catch (e) {
      console.log(e);

      setLoginError(e);
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
            {error.message}
          </Text>
        )}
        <View style={styles.input}>
          <TextInput
            value={Email}
            placeholder="Enter your email address"
            onChangeText={(value) => setEmail(value)}
          />
        </View>
        <View style={{ marginVertical: 10 }} />
        <View style={styles.input}>
          <TextInput
            value={Password}
            secureTextEntry={true}
            placeholder="Enter your Password"
            onChangeText={(value) => setPassword(value)}
          />
        </View>
        <View style={{ marginVertical: 10 }} />

        <View style={styles.alignCenter}>
          <TouchableOpacity
            onPress={() => handleLogin()}
            disabled={isLoading}
            style={[styles.button, styles.alignCenter]}
          >
            {!isLoading ? (
              <Text style={{ color: "#fff", fontSize: 15 }}> Sign In </Text>
            ) : (
              <ActivityIndicator color="#fff" />
            )}
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical: 10 }} />

        <TouchableOpacity
          onPress={() => props.navigation.navigate("create-account")}
        >
          <View style={styles.flex}>
            <Text style={styles.infoText}>Don't Have An Account?</Text>

            <Text style={[styles.infoText, { color: "black", marginLeft: 10 }]}>
              Create Account
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

export default Login;
