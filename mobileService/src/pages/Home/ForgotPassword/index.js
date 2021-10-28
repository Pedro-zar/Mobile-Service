import React, { useState, useEffect } from "react";

import { StatusBar, View, Keyboard, Alert, ScrollView } from "react-native";

import Icon from "react-native-vector-icons/Entypo";

import { useDispatch } from "react-redux";

import BackgroundTimer from "react-native-background-timer";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { setRole } from "~store/actions";

import Logo from "~assets/img/logo_anchieta.png";

import api from "~services/api";

import SuccessModal from "~components/Modals/Success";
import ErrorModal from "~components/Modals/ErrorModal";
import LoadingModal from "~components/Modals/Loading";
import Background from "~components/Background";
import GoBackButton from "~components/GoBackButton";
import InputPhone from "~components/MaskedInputs/InputPhone";
import InputVerifyCode from "~components/MaskedInputs/InputVerifyCode";

import {
  LogoImage,
  Title,
  Button,
  Subtitle,
  ConfirmButton,
  ChangeNumber,
  ChangeNumberText,
  IconText,
  Body,
  Container,
  Header,
  SmsText,
  CodeContainer,
  ContainerInput,
  ConfirmButtonText,
  Column,
} from "./style";

const ForgotPassword = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const [RTTimer, setRTTimer] = useState(null);
  const [timerOn, setTimerOn] = useState(false);

  const [reenviarToken, setReenviarToken] = useState(false);

  const [phone, setPhone] = useState("");
  const [phoneRef, setPhoneRef] = useState({});
  const [phoneEditable, setPhoneEditable] = useState(true);
  const [phoneError, setPhoneError] = useState(false);

  const [editableInput, setEditableInput] = useState(false);
  const [changeNumberEnabled, setChangeNumberEnabled] = useState(false);

  const [verifyCode1Ref, setVerifyCode1Ref] = useState({});
  const [verifyCode2Ref, setVerifyCode2Ref] = useState({});
  const [verifyCode3Ref, setVerifyCode3Ref] = useState({});
  const [verifyCode4Ref, setVerifyCode4Ref] = useState({});
  const [verifyCode5Ref, setVerifyCode5Ref] = useState({});
  const [verifyCode6Ref, setVerifyCode6Ref] = useState({});

  const [verifyCode1, setVerifyCode1] = useState("");
  const [verifyCode2, setVerifyCode2] = useState("");
  const [verifyCode3, setVerifyCode3] = useState("");
  const [verifyCode4, setVerifyCode4] = useState("");
  const [verifyCode5, setVerifyCode5] = useState("");
  const [verifyCode6, setVerifyCode6] = useState("");

  const [confirmNumberDisabled, setConfirmNumberDisabled] = useState(false);

  useEffect(() => {
    if (timerOn) timerEngine();
    else BackgroundTimer.stopBackgroundTimer();

    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
  }, [timerOn]);

  useEffect(() => {
    if (RTTimer === 0) {
      BackgroundTimer.stopBackgroundTimer();
      setReenviarToken(true);
      setTimerOn(false);
    }
  }, [RTTimer]);

  /**
   * Timer de reenvio de token
   */
  const timerEngine = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      setRTTimer((RTTimer) => {
        if (RTTimer > 0) return RTTimer - 1;
        else return 0;
      });
    }, 1000);
  };

  /**
   * Função para focar no próximo código e deixá-lo vazio
   * @param {object} ref campo a ser focado
   * @param {React.Dispatch<React.SetStateAction<string>>} setCode setter para definir o próximo campo
   */
  const focusNextCode = (ref, setCode) => {
    ref?.getElement().focus();
    setCode("");
  };

  /**
   * Valida se o telefone tem a quantidade de digitos correta
   * @returns Se é válido ou não
   */
  const validPhone = () => {
    return !(phone.length == 11 || phone.length == 10);
  };

  /**
   * Verifica se pode enviar token
   * @param {boolean} isValid se o telefone é válido
   * @param {boolean} change se é necessário trocar o telefone ou não, esse parâmetro pode ser omitido
   */
  const confirmButton = (isValid, change = false) => {
    if (isValid) {
      if (!change) setPhoneError(true);
      setPhoneEditable(true);
      setConfirmNumberDisabled(false);
      setEditableInput(false);
      setChangeNumberEnabled(false);
      setVerifyCode1("");
      setVerifyCode2("");
      setVerifyCode3("");
      setVerifyCode4("");
      setVerifyCode5("");
      setVerifyCode6("");
      setEmail("");
    } else {
      sendToken();
    }
  };

  /**
   * Envia o Token
   */
  const sendToken = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.post(`senha/enviar_token.php`, {
        telefone: phone,
      });
      if (data.error) {
        setIsLoading(false);
        setErrorModalVisible(true);
        setErrorModalMessage(data.message);
        setEmail("");
      } else {
        setIsLoading(false);
        setEditableInput(true);
        setReenviarToken(true);
        setEmail(data.email);
        setPhoneError(false);
        setPhoneEditable(false);
        setConfirmNumberDisabled(true);
        setChangeNumberEnabled(true);
        Keyboard.dismiss();
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
  };

  /**
   * Verifica o token
   */
  const filledCode = async () => {
    setIsLoading(true);
    let userCode = `${verifyCode1}${verifyCode2}${verifyCode3}${verifyCode4}${verifyCode5}${verifyCode6}`;
    try {
      const { data } = await api.post(`senha/verificar_token.php`, {
        token: userCode,
        telefone: phone,
      });
      if (data.error) {
        setIsLoading(false);
        setErrorModalVisible(true);
        setErrorModalMessage(data.message);
      } else {
        setIsLoading(false);
        try {
          await AsyncStorage.setItem("@userRole", userCode);
          const data = {
            TIPO: userCode,
          };
          dispatch(setRole(data));
          navigation.goBack();
          navigation.navigate("NewPassword");
        } catch (e) {}
      }
    } catch (e) {
      console.log(e);
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
  };

  /**
   * Reenvia o Token
   */
  const onReenviarTokenPress = async () => {
    setTimerOn(true);
    setRTTimer(60);
    setReenviarToken(false);
    try {
      setIsLoading(true);
      const { data } = await api.post(`senha/reenviar_token.php`, {
        telefone: phone,
      });
      if (data.error) {
        setIsLoading(false);
        setShowErrorModal(true);
        setErrorModalMessage(data.message);
      } else {
        setIsLoading(false);
        setSuccessModalVisible(true);
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
  };

  return (
    <Background>
      <StatusBar backgroundColor="#27458b" barStyle="light-content" />
      <ScrollView>
        <GoBackButton navigation={navigation} />
        <Container>
          <Header>
            <LogoImage source={Logo} />
            <Title>Trocar senha</Title>
          </Header>
          <Body>
            <Subtitle>Insira seu telefone</Subtitle>
            <ContainerInput>
              <InputPhone
                phoneRef={setPhoneRef}
                value={phone}
                autoFocus={true}
                onChangeText={setPhone}
                onBlur={validPhone}
                error={phoneError}
                blurSubmit={true}
                last={true}
                next={Keyboard.dismiss}
                editable={phoneEditable}
              />
              <ConfirmButton
                disabled={confirmNumberDisabled}
                onPress={() => confirmButton(validPhone())}
              >
                <ConfirmButtonText>Confirmar</ConfirmButtonText>
                <ConfirmButtonText>número</ConfirmButtonText>
              </ConfirmButton>
            </ContainerInput>
            <View>
              <ChangeNumber
                onPress={() => confirmButton(true, true)}
                disabled={!changeNumberEnabled}
              >
                <ChangeNumberText enabled={changeNumberEnabled}>
                  Trocar número
                </ChangeNumberText>
              </ChangeNumber>
            </View>
            <View>
              <Subtitle>Confirme seu telefone</Subtitle>
              <SmsText>
                Enviamos um token de verificação via SMS,{"\n"}
                insira-o abaixo para confirmar seu telefone!{"\n"}
                {email != "" ? `Seu email: ${email}` : ""}
              </SmsText>
              <CodeContainer>
                <InputVerifyCode
                  editable={editableInput}
                  last={false}
                  ref={setVerifyCode1Ref}
                  next={() => focusNextCode(verifyCode2Ref, setVerifyCode2)}
                  value={verifyCode1}
                  onChangeText={(text) => {
                    setVerifyCode1(text);
                    focusNextCode(verifyCode2Ref, setVerifyCode2);
                  }}
                />
                <InputVerifyCode
                  editable={editableInput}
                  last={false}
                  ref={setVerifyCode2Ref}
                  next={() => focusNextCode(verifyCode3Ref, setVerifyCode3)}
                  value={verifyCode2}
                  onChangeText={(text) => {
                    setVerifyCode2(text);
                    focusNextCode(verifyCode3Ref, setVerifyCode3);
                  }}
                />
                <InputVerifyCode
                  editable={editableInput}
                  last={false}
                  ref={setVerifyCode3Ref}
                  next={() => focusNextCode(verifyCode4Ref, setVerifyCode4)}
                  value={verifyCode3}
                  onChangeText={(text) => {
                    setVerifyCode3(text);
                    focusNextCode(verifyCode4Ref, setVerifyCode4);
                  }}
                />
                <InputVerifyCode
                  editable={editableInput}
                  last={false}
                  ref={setVerifyCode4Ref}
                  next={() => focusNextCode(verifyCode5Ref, setVerifyCode5)}
                  value={verifyCode4}
                  onChangeText={(text) => {
                    setVerifyCode4(text);
                    focusNextCode(verifyCode5Ref, setVerifyCode5);
                  }}
                />
                <InputVerifyCode
                  editable={editableInput}
                  last={false}
                  ref={setVerifyCode5Ref}
                  next={() => focusNextCode(verifyCode6Ref, setVerifyCode6)}
                  value={verifyCode5}
                  onChangeText={(text) => {
                    setVerifyCode5(text);
                    focusNextCode(verifyCode6Ref, setVerifyCode6);
                  }}
                />
                <InputVerifyCode
                  editable={editableInput}
                  last={true}
                  ref={setVerifyCode6Ref}
                  next={Keyboard.dismiss}
                  value={verifyCode6}
                  onChangeText={(text) => {
                    setVerifyCode6(text);
                    Keyboard.dismiss();
                  }}
                />
                <Column>
                  <Button
                    onPress={() => {
                      filledCode();
                    }}
                    disabled={!editableInput}
                  >
                    <Icon
                      name={"forward"}
                      size={30}
                      style={{
                        paddingLeft: 5,
                        color: "#fff",
                        opacity: editableInput ? 1 : 0.6,
                      }}
                    />
                    <IconText enabled={editableInput}>Prosseguir</IconText>
                  </Button>
                  {reenviarToken ? (
                    <Button
                      onPress={() => {
                        onReenviarTokenPress();
                      }}
                      disabled={!editableInput}
                    >
                      <Icon
                        name={"ccw"}
                        size={30}
                        style={{
                          paddingTop: 15,
                          paddingLeft: 5,
                          color: "#fff",
                          opacity: editableInput ? 1 : 0.6,
                        }}
                      />
                      <IconText enabled={editableInput}>Reenviar</IconText>
                      <IconText enabled={editableInput}>Token</IconText>
                    </Button>
                  ) : (
                    <></>
                  )}
                </Column>
              </CodeContainer>
            </View>
          </Body>
        </Container>
      </ScrollView>
      <SuccessModal
        message={"Token reenviado com sucesso!"}
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
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

export default ForgotPassword;
