import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { ApolloProvider } from "@apollo/client";
import { createStackNavigator } from "@react-navigation/stack";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { NavigationContainer } from "@react-navigation/native";

import Home from "./src/screens/home";
import CreateRecording from "./src/screens/create-recording";
import CreateAccount from "./src/screens/create-account";
import Login from "./src/screens/login";
import { getItem, USER_TOKEN_KEY } from "./src/storage";
import { onError } from "apollo-link-error";

const headerTitleStyle = {
  fontSize: 17,
  color: "#fff",
  fontWeight: "normal",
};

export default function App() {
  const [token, setToken] = useState(null);
  const Stack = createStackNavigator();

  useEffect(() => {
    (async function () {
      const data = await getItem(USER_TOKEN_KEY);
      setToken(data);
    })();
  }, []);

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      onError(({ graphQLErrors }) => {
        if (graphQLErrors) {
          console.log(graphQLErrors);
        }
      }),
      new HttpLink({
        uri: "http://localhost:1337/graphql",
        headers: token
          ? {
              Authorization: `Bearer ${token.jwt}`,
            }
          : null,
      }),
    ]),
  });

  return (
    <NavigationContainer>
      <ApolloProvider client={client}>
        <StatusBar style="auto" />

        <Stack.Navigator>
          <Stack.Screen
            options={{
              title: "Login",
              headerShown: false,
              headerTitleStyle,
              headerLeftContainerStyle: {
                color: "#fff",
              },
              headerStyle: {
                backgroundColor: "#8c4bff",
              },
            }}
            name="login"
            component={Login}
          />

          <Stack.Screen
            options={{
              title: "CreateAccount",
              headerTitleStyle,
              headerShown: false,
              headerLeftContainerStyle: {
                color: "#fff",
              },
              headerStyle: {
                backgroundColor: "#8c4bff",
              },
            }}
            name="create-account"
            component={CreateAccount}
          />

          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: "#8c4bff",
              },
              headerLeft: null,
              title: "My Recordings",
              headerTitleStyle,
            }}
            name="home"
            component={Home}
          />
          <Stack.Screen
            options={{
              title: "New Recording",
              headerTitleStyle,
              headerStyle: {
                backgroundColor: "#8c4bff",
              },
            }}
            name="CreateRecording"
            component={CreateRecording}
          />
        </Stack.Navigator>
      </ApolloProvider>
    </NavigationContainer>
  );
}
