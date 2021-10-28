import React from "react";

import { StatusBar, ScrollView } from "react-native";

import { useDispatch } from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Logo from "~assets/img/logo_anchieta.png";

import { setRole } from "~store/actions.js";

import Background from "~components/Background";
import GoBackButton from "~components/GoBackButton";

import {
  Body,
  Bottom,
  Button,
  LogoImage,
  TextButton,
  Title,
  TitleContainer,
} from "./style";

const ChoseAccountType = ({ navigation }) => {
  const dispatch = useDispatch();

  /**
   * Guarda tipo de conta e procede para próxima tela
   * @param {"Cliente" | "Profissional"} AccountType Tipo de conta selecionada para criar
   */
  const proccedSignIn = async (AccountType) => {
    try {
      await AsyncStorage.setItem("@tipo", AccountType);
      const data = {
        TIPO: AccountType,
      };
      dispatch(setRole(data));
      navigation.navigate("AccountData");
    } catch (e) {}
  };

  return (
    <Background>
      <StatusBar backgroundColor="#27458b" barStyle="light-content" />
      <ScrollView>
        <GoBackButton navigation={navigation} />
        <Body>
          <LogoImage source={Logo} />
          <TitleContainer>
            <Title>Você quer se</Title>
            <Title>registrar como:</Title>
          </TitleContainer>
        </Body>
        <Bottom>
          <Button onPress={() => proccedSignIn("Profissional")}>
            <TextButton>Profissional</TextButton>
          </Button>
          <Button onPress={() => proccedSignIn("Cliente")}>
            <TextButton>Cliente</TextButton>
          </Button>
        </Bottom>
      </ScrollView>
    </Background>
  );
};

export default ChoseAccountType;
