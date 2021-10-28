import React from "react";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import Icon from "react-native-vector-icons/Ionicons";

import { Host } from "react-native-portalize";

import { gestureHandlerRootHOC } from "react-native-gesture-handler";

import Home from "~pages/Profissional/Home";
import Config from "~pages/Config";
import Chat from "~routes/chat.routes";

const Tab = createMaterialBottomTabNavigator();

/**
 * Rota de páginas para o profissional logado
 * @returns Tab navigator com páginas do Profissional
 */
const ProfissionalRoute = () => {
  return (
    <Host>
      <Tab.Navigator
        activeColor="#fffaff"
        inactiveColor="#999999"
        barStyle={{ backgroundColor: "#213A74" }}
        labeled={false}
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            switch (route.name) {
              case "Home":
              default:
                iconName = "ios-home";
                break;
              case "Config":
                iconName = "settings";
                break;
              case "Chat":
                iconName = "chatbox-ellipses";
                break;
            }

            return <Icon name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Config" component={Config} />
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Chat" component={Chat} />
      </Tab.Navigator>
    </Host>
  );
};

export default gestureHandlerRootHOC(ProfissionalRoute);
