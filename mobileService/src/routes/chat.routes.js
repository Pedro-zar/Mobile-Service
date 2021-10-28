import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import Background from "~components/Background";

import Message from "~pages/Chat/Message";
import Conversas from "~pages/Chat/Conversas";

const Stack = createStackNavigator();

/**
 * Chat System
 * @returns StackNav com StackScreen do chat de conversas e messages
 */
const ChatRoute = () => (
  <Background>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Conversas" component={Conversas} />
      <Stack.Screen name="Message" component={Message} />
    </Stack.Navigator>
  </Background>
);

export default ChatRoute;
