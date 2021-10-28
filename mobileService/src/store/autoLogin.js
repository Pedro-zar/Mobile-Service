import AsyncStorage from "@react-native-async-storage/async-storage";

const setAutoLogin = async (data) => {
  await AsyncStorage.setItem("autoLoginUserData", JSON.stringify(data));
};

const getAutoLogin = async () => {
  try {
    let userData = await AsyncStorage.getItem("autoLoginUserData");
    return JSON.parse(userData);
  } catch (e) {
    console.log(e);
  }
};

export { getAutoLogin, setAutoLogin };
