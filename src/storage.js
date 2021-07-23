import AsyncStorage from "@react-native-async-storage/async-storage";

export const USER_TOKEN_KEY = "@USER_TOKEN";
export const USER_ID_KEY = "@USER_ID";

const validateParameter = (key) => {
  if (!key && key !== String) {
    throw new Error("Invalid key specified");
  }
};

export const setItem = async (itemKey, itemValue) => {
  if (!key && !val && typeof key !== String && val !== String) {
    throw new Error("Invalid key or val specified");
  }

  try {
    await AsyncStorage.setItem(
      itemKey,
      JSON.stringify({
        data: itemValue,
      })
    );
  } catch (e) {
    console.log(`Error setting key: ${e}`);
  }
};

export const clearItem = async (key) => {
  validateParameter(key);

  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(`Error removing key: ${e}`);
  }
};

export const getItem = async (key) => {
  validateParameter(key);

  try {
    const data = await AsyncStorage.getItem(key);
    return JSON.parse(data);
  } catch (e) {
    console.log(`Error removing key: ${e}`);
  }
};
