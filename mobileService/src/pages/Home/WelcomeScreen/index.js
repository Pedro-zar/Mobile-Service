import React from "react";

import { StatusBar, ScrollView, Alert } from "react-native";
import { useDispatch } from "react-redux";

import Logo from "~assets/img/logo_anchieta.png";

import { getAutoLogin } from "~store/autoLogin";
import Background from "~components/Background";
import { setUser } from "~store/actions";

import {
  BodyWrapper,
  Button,
  HeaderWrapper,
  LogoImage,
  TextButton,
  Title,
  TitleContainer,
} from "./style";
import api from "~services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

export default WelcomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const autoLoginMethod = async () => {
    const autoLogin = await getAutoLogin();
    try {
      const { data } = await api.post("login/auth.php", {
        email: autoLogin.email,
        senha: autoLogin.senha,
      });
      console.log(autoLogin);
      if (data.error) {
        Alert.alert("Erro", "Falha no LogIn automático");
      } else {
        if (data.TIPO == "2") {
          try {
            await AsyncStorage.setItem("@tipo", "prof");
          } catch (e) {}
          data.TIPO = "prof";
        } else {
          try {
            await AsyncStorage.setItem("@tipo", "clie");
          } catch (e) {}
          data.TIPO = "clie";
        }
        dispatch(setUser(data));
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    autoLoginMethod();
  }, []);

  return (
    <Background>
      <StatusBar backgroundColor="#27458b" barStyle="light-content" />
      <ScrollView>
        <HeaderWrapper>
          <LogoImage source={Logo} />
          <TitleContainer>
            <Title>Bem vindo ao</Title>
            <Title>Mobile Service</Title>
          </TitleContainer>
        </HeaderWrapper>
        <BodyWrapper>
          <Button onPress={() => navigation.navigate("Login")}>
            <TextButton>Entrar</TextButton>
          </Button>
          <Button onPress={() => navigation.navigate("AccountType")}>
            <TextButton>Registrar</TextButton>
          </Button>
        </BodyWrapper>
      </ScrollView>
    </Background>
  );
};
