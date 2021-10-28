import React, { useRef, useState } from "react";

import { View, StatusBar, Keyboard, Alert, ScrollView } from "react-native";

import Icon from "react-native-vector-icons/Entypo";

import { useSelector } from "react-redux";

import Logo from "~assets/img/logo_anchieta.png";

import Background from "~components/Background";
import GoBackButton from "~components/GoBackButton";
import InputSignup from "~components/InputSignup";
import LoadingModal from "~components/Modals/Loading";
import SuccessModal from "~components/Modals/Success";
import ErrorModal from "~components/Modals/ErrorModal";

import api from "~services/api";

import { user } from "~store/selectors";

import {
  BodyWrapper,
  BottomWrapper,
  Button,
  Container,
  IconText,
  LogoImage,
  Subtitle,
  Title,
} from "./style";

const NewPassword = ({ navigation }) => {
  const userData = useSelector(user);
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [verifyPasswordError, setVerifyPasswordError] = useState(false);
  const passwordRef = useRef(null);
  const verifyPasswordRef = useRef(null);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState("");
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Foca no campo de verificar senha
   */
  const focusVerifyPassword = () => {
    verifyPasswordRef?.current.focus();
  };

  /**
   * fazer troca de senha
   */
  const changePassword = async () => {
    setIsLoading(true);
    if (validPassword()) {
      try {
        const { data } = await api.post(`senha/trocar_senha.php`, {
          token: userData.tipo,
          senha: password,
        });
        setIsLoading(false);
        if (data.error) {
          setErrorModalVisible(true);
          setErrorModalMessage(data.message);
          console.log("deu erro");
        } else {
          setSuccessModalVisible(true);
          setSuccessModalMessage("Senha alterada com sucesso!");
        }
      } catch (e) {
        setIsLoading(false);
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
    }
    setIsLoading(false);
  };

  /**
   * Valida a senha inserida
   * @returns Se é válida ou não
   */
  const validPassword = () => {
    Keyboard.dismiss();
    setPasswordError(false);
    setVerifyPasswordError(false);

    if (password.length < 8) {
      Alert.alert(
        "Senha inválida",
        "A senha deve conter no mínimo 8 caracteres.",
        [
          {
            text: "ok",
          },
        ],
        { cancelable: false }
      );

      setPasswordError(true);
      return false;
    } else if (password != verifyPassword) {
      Alert.alert(
        "Senha inválida",
        "Senhas não conferem.",
        [
          {
            text: "ok",
          },
        ],
        { cancelable: false }
      );

      setVerifyPasswordError(true);
      return false;
    }
    return true;
  };

  return (
    <Background>
      <StatusBar backgroundColor="#27458b" barStyle="light-content" />
      <ScrollView>
        <GoBackButton navigation={navigation} />
        <Container>
          <View>
            <LogoImage source={Logo} />
            <Title>Trocar senha</Title>
          </View>
          <BodyWrapper>
            <Subtitle>Insira sua nova senha abaixo</Subtitle>
            <InputSignup
              ref={passwordRef}
              title="Senha"
              placeholder="Digite sua nova senha"
              value={password}
              onChangeText={setPassword}
              password={true}
              error={passwordError}
              width={80}
              next={focusVerifyPassword}
            />
            <InputSignup
              ref={verifyPasswordRef}
              title="Confirme a senha"
              placeholder="Confirme sua senha"
              value={verifyPassword}
              onChangeText={setVerifyPassword}
              password={true}
              error={verifyPasswordError}
              width={80}
              next={Keyboard.dismiss}
              onBlur={validPassword}
              last={true}
            />
            <BottomWrapper>
              <Button onPress={() => changePassword()}>
                <Icon
                  name={"forward"}
                  size={30}
                  style={{
                    paddingLeft: 5,
                    color: "#fff",
                    opacity: 1,
                  }}
                />
                <IconText>Prosseguir</IconText>
              </Button>
            </BottomWrapper>
          </BodyWrapper>
        </Container>
      </ScrollView>
      <SuccessModal
        visible={successModalVisible}
        message={successModalMessage}
        onClose={() => navigation.goBack()}
      />
      <LoadingModal visible={isLoading} />
      <ErrorModal
        visible={errorModalVisible}
        message={errorModalMessage}
        onClose={setErrorModalVisible}
      />
    </Background>
  );
};
export default NewPassword;
