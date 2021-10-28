import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import WelcomeScreen from "~pages/Home/WelcomeScreen";
import Login from "~pages/Home/Login";
import AccountType from "~pages/Home/SignIn/ChoseAccountType";
import AccountData from "~pages/Home/SignIn/InputAccountData";
import ForgotPassword from "~pages/Home/ForgotPassword";
import NewPassword from "~pages/Home/NewPassword";

import Background from "~components/Background";

const Stack = createStackNavigator();

/**
 * Route com Telas Pré-Login
 * @returns StackNav com StackScreen atual
 */
const HomeRoute = () => (
  <Background>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="AccountType" component={AccountType} />
      <Stack.Screen name="AccountData" component={AccountData} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="NewPassword" component={NewPassword} />
    </Stack.Navigator>
  </Background>
);

export default HomeRoute