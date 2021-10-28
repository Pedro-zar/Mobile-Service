import React, { useRef, useState } from "react";

import {
  StatusBar,
  Alert,
  Pressable,
  Keyboard,
  ScrollView,
} from "react-native";

import { useDispatch } from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { setUser } from "~store/actions.js";

import Logo from "~assets/img/logo_anchieta.png";

import Background from "~components/Background";
import InputLogin from "~components/InputLogin";
import GoBackButton from "~components/GoBackButton";
import LoadingModal from "~components/Modals/Loading";
import ErrorModal from "~components/Modals/ErrorModal";

import api from "~services/api";

import {
  Body,
  Button,
  ForgotPasswordButton,
  ForgotPasswordText,
  Header,
  LogoImage,
  TextButton,
} from "./style";
import { setAutoLogin } from "~store/autoLogin";

export default Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");

  /**
   * Vê se usuario preencheu corretamente e tenta fazer o login
   */
  const handleLogin = () => {
    switch (false) {
      case isEmpty(setErrorEmail, email, emailRef):
        Alert.alert("Erro", "Informe o usuário");
        break;
      case isEmpty(setErrorPassword, password, passwordRef):
        Alert.alert("Erro", "Informe a senha");
        break;
      default:
        getUser();
        break;
    }
  };

  /**
   * Função para verificar se o texto é válido ou não
   * @param {React.SetStateAction<boolean>} setError função para settar erro como true ou falso
   * @param {string} text Texto a ser verificado
   * @param {React.MutableRefObject<any>} ref Ref a ser focado se estiver vazio
   * @returns Retorna se o texto está vazio(false) ou não
   */
  const isEmpty = (setError, text, ref) => {
    const isFilled = !text.trim() == "";
    setError(!isFilled);
    !isFilled && ref?.current.focus();
    return isFilled;
  };

  /**
   * Pega dados do usuario do banco de dados
   */
  const getUser = async () => {
    setLoadingModalVisible(true);
    try {
      const { data } = await api.post("login/auth.php", {
        email: email,
        senha: password,
      });
      setLoadingModalVisible(false);
      validUser(data, password);
    } catch (e) {
      setLoadingModalVisible(false);
      Alert.alert(
        "Ocorreu um erro",
        "houve um erro em nossos servidores, tente novamente mais tarde.",
        [
          {
            text: "ok",
          },
        ],
        { cancelable: false }
      );
    }
  };

  /**
   * Valida usuario e altera dados do storage
   * @param {{error:boolean, message:string, TIPO: string, EMAIL:string}} userData Dados do usuário no asyncStorage
   */
  const validUser = async (userData, senha) => {
    if (userData.error) {
      setErrorModalMessage(userData.message);
      setErrorModalVisible(true);
      setErrorEmail(true);
      setErrorPassword(true);
    } else {
      if (userData.TIPO == "2") {
        storageUserRole("prof");
        userData.TIPO = "prof";
      } else {
        storageUserRole("clie");
        userData.TIPO = "clie";
      }
      console.log(userData);
      setAutoLogin({ email: userData.EMAIL, senha: senha });
      dispatch(setUser(userData));
    }
  };

  /**
   * Guarda User Role no storage
   * @param {"prof" | "clie"} userRole tipo de conta para login
   */
  const storageUserRole = async (userRole) => {
    try {
      await AsyncStorage.setItem("@tipo", userRole);
    } catch (e) {}
  };

  return (
    <Background>
      <StatusBar backgroundColor="#27458b" barStyle="light-content" />
      <ScrollView>
        <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
          <GoBackButton navigation={navigation} />
          <Header>
            <LogoImage source={Logo} />
          </Header>
          <Body>
            <InputLogin
              error={errorEmail}
              icon="user"
              next={() => passwordRef?.current.focus()}
              onChangeText={setEmail}
              placeholder="E-mail"
              ref={emailRef}
              blurSubmit={false}
            />
            <InputLogin
              error={errorPassword}
              icon="lock"
              onChangeText={setPassword}
              password={true}
              placeholder="Senha"
              blurSubmit={true}
              ref={passwordRef}
              value={password}
            />
            <ForgotPasswordButton
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <ForgotPasswordText>Esqueceu sua senha?</ForgotPasswordText>
            </ForgotPasswordButton>
            <Button onPress={handleLogin}>
              <TextButton>Entrar</TextButton>
            </Button>
          </Body>
          <LoadingModal visible={loadingModalVisible} />
          <ErrorModal
            visible={errorModalVisible}
            message={errorModalMessage}
            onClose={setErrorModalVisible}
          />
        </Pressable>
      </ScrollView>
    </Background>
  );
};
