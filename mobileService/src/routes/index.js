import React from "react";

import { NavigationContainer } from "@react-navigation/native";

import { useSelector } from "react-redux";

import HomeRoute from "~routes/home.routes";
import ClienteRoute from "~routes/cliente.routes";
import ProfissionalRoute from "~routes/profissional.routes";

import { user } from "~store/selectors";

/**
 * Router
 * @returns NavContainers com as páginas atuais
 */
const Routes = () => {
  const userData = useSelector(user);

  if (userData.logged) {
    switch (userData.tipo) {
      case "prof":
        return (
          <NavigationContainer>
            <ProfissionalRoute />
          </NavigationContainer>
        );
      case "clie":
        return (
          <NavigationContainer>
            <ClienteRoute />
          </NavigationContainer>
        );
    }
  }
  return (
    <NavigationContainer>
      <HomeRoute />
    </NavigationContainer>
  );
};
export default Routes;
