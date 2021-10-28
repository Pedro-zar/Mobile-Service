import React, { useRef, useState } from "react";

import { useSelector } from "react-redux";

import {
  StatusBar,
  Alert,
  Keyboard,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from "react-native";

import api from "~services/api";

import { user } from "~store/selectors";

import { registerUser } from "~Realm/Database";

import Background from "~components/Background";
import InputSignup from "~components/InputSignup";
import InputPhone from "~components/MaskedInputs/InputPhone";
import InputCPF from "~components/MaskedInputs/InputCPF";
import InputZipCode from "~components/MaskedInputs/InputZipCode";
import GoBackButton from "~components/GoBackButton";
import ErrorModal from "~components/Modals/ErrorModal";
import LoadingModal from "~components/Modals/Loading";
import SuccessModal from "~components/Modals/Success";

import {
  Body,
  Bottom,
  Button,
  Header,
  LoadingCep,
  TextButton,
  Title,
  Row,
  LoadingCepText,
} from "./style";

const AccountData = ({ navigation }) => {
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");

  const [nome, setNome] = useState("");
  const [nomeError, setNomeError] = useState(false);
  const nomeRef = useRef(null);

  const userData = useSelector(user);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const emailRef = useRef(null);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const passwordRef = useRef(null);
  const [verifyPassword, setVerifyPassword] = useState("");
  const [verifyPasswordError, setVerifyPasswordError] = useState(false);
  const verifyPasswordRef = useRef(null);

  const [cpf, setCpf] = useState("");
  const [cpfError, setCpfError] = useState(false);
  const [cpfRef, setCpfRef] = useState({});

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [phoneRef, setPhoneRef] = useState({});

  const [cep, setCep] = useState("");
  const [cepError, setCepError] = useState(false);
  const [cepRef, setCepRef] = useState({});
  const [loadingCep, setLoadingCep] = useState(false);

  const [uf, setUf] = useState("");
  const [city, setCity] = useState("");

  const [district, setDistrict] = useState("");
  const [districtError, setDistrictError] = useState(false);
  const districtRef = useRef(null);

  const [street, setStreet] = useState("");
  const [streetError, setStreetError] = useState(false);
  const streetRef = useRef(null);

  const [houseNumber, setHouseNumber] = useState("");
  const [houseNumberError, setHouseNumberError] = useState(false);
  const houseNumberRef = useRef(null);

  const [houseComp, setHouseComp] = useState("");
  const [houseCompError, setHouseCompError] = useState(false);
  const houseCompRef = useRef(null);

  /**
   * Verifica todos campos e procede com o registro
   */
  const handleSignup = () => {
    Keyboard.dismiss();
    setLoadingModalVisible(true);
    switch (false) {
      case validNome(true):
        Alert.alert("Erro", "Nome inválido");
        break;
      case validEmail(true):
        Alert.alert("Erro", "E-mail inválido");
        break;
      case validPassword():
        break;
      case validCPF(true):
        Alert.alert("Erro", "CPF inválido");
        break;
      case validPhone(true):
        Alert.alert("Erro", "Telefone inválido");
        break;
      case isEmpty(district, setDistrictError):
        Alert.alert("Erro", "Bairro inválido");
        break;
      case isEmpty(street, setStreetError):
        Alert.alert("Erro", "Rua inválida");
        break;
      case isEmpty(houseNumber, setHouseNumberError):
        Alert.alert("Erro", "Número da casa inválido");
        break;
      case isEmpty(cep, setCepError):
      case isEmpty(uf, setCepError):
      case isEmpty(city, setCepError):
        Alert.alert("Erro", "CEP inválido");
        break;
      default:
        createUser().then(() => setLoadingModalVisible(false));
        break;
    }
  };

  /**
   * Cadastra o usuário no sistema
   */
  const createUser = async () => {
    setLoadingModalVisible(true);
    try {
      const { data } = await api.post("cadastro/cadastra_usuario.php", {
        nome: nome,
        email: email,
        telefone: phone,
        cpf: cpf,
        cep: cep,
        uf: uf,
        cidade: city,
        bairro: district,
        rua: street,
        end_numero: houseNumber,
        end_complemento: houseComp,
        senha: password,
        realm_id: null,
        userRole: userData.tipo,
      });
      if (data.error) {
        setErrorModalMessage(data.message);
        setErrorModalVisible(true);
      } else {
        await registerUser(cpf).then(() => {
          setSuccessModalMessage(data.message);
          setSuccessModalVisible(true);
        });
      }
      setLoadingModalVisible(false);
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
   * Volta para a tela inicial
   */
  const handleCloseModalSuccess = () => {
    navigation.goBack();
    navigation.goBack();
  };

  /**
   * Função que válida se o campo Nome foi preenchido ou não
   * @param {boolean} focusInput se deve ser focado ou não no campo se houver erro
   * @returns Se o campo Nome está vazio ou não
   */
  const validNome = (focusInput = false) => {
    if (nome.trim() == "") {
      focusInput && nomeRef.current?.focus();
      setNomeError(true);
      setLoadingModalVisible(false);
      return false;
    } else {
      setNomeError(false);
      return true;
    }
  };

  /**
   * Função que válida se o campo Email foi preenchido ou não
   * @param {boolean} focusInput se deve ser focado ou não no campo se houver erro
   * @returns Se o campo Email está vazio ou não
   */
  const validEmail = (focusInput = false) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)) {
      setEmailError(true);
      focusInput && emailRef.current?.focus();
      setLoadingModalVisible(false);
      return false;
    } else {
      setEmailError(false);
      return true;
    }
  };

  /**
   * Função que valida se o campo foi preenchido corretamente ou não
   * @returns Indicação de se o campo foi preenchido (true) ou não (false)
   */
  const validPassword = () => {
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
      setLoadingModalVisible(false);
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

      setLoadingModalVisible(false);
      setVerifyPasswordError(true);
      return false;
    }
    return true;
  };

  /**
   * Função para validar se o campo de telefone foi preenchido corretamente
   * @param {boolean} focusInput se deve ser focado ou não no campo se houver erro
   * @returns Se o telefone foi preenchido (true) ou não (false)
   */
  const validPhone = (focusInput = false) => {
    const isValid = !(phone.length == 11 || phone.length == 10);

    if (isValid) {
      focusInput && phoneRef.getElement().focus();
      setPhoneError(true);
      setLoadingModalVisible(false);
      return false;
    } else {
      setPhoneError(false);
      return true;
    }
  };

  /**
   * Função para verificar se o CPF foi preenchido corretamente ou não
   * @param {boolean} focusInput se deve ser focado ou não no campo se houver erro
   * @returns Se o campo CPF foi preenchido corretamente ou não
   */
  const validCPF = (focusInput = false) => {
    if (cpfRef.isValid()) {
      setCpfError(false);
      return true;
    } else {
      focusInput && cpfRef.getElement().focus();
      setCpfError(true);
      setLoadingModalVisible(false);
      return false;
    }
  };

  /**
   * Valida Cep e puxa dados de endereço
   * @returns Se o cep é válido ou não
   */
  const validCEP = async () => {
    let auxError = false;
    if (cep.length === 8) {
      try {
        setLoadingCep(true);

        const { data } = await api.get(`utils/consulta_cep.php?cep=${cep}`);

        auxError = data.erro;

        if (!auxError) {
          handleValidCep(data);
          setCepError(false);
        }
      } catch (e) {
        Alert.alert(
          "Ocorreu um erro",
          "houve um erro em nosso servidores, tente novamente mais tarde.",
          [
            {
              text: "ok",
            },
          ],
          { cancelable: false }
        );
        setCepError(true);
        setLoadingCep(false);
        return false;
      }
    } else {
      auxError = true;
    }

    if (auxError) {
      Alert.alert("Erro", "CEP inválido.");
      setUf("");
      setCity("");
      setDistrict("");
      setStreet("");
      setCepError(true);
      setLoadingCep(false);
    }

    return !auxError;
  };

  /**
   * Trata dados e insere nos TextInputs corretos
   * @param {{uf:string, cidade:string, bairro:string,logradouro:string}} cepData Dados da API dos correios
   */
  const handleValidCep = (cepData) => {
    setUf(cepData.uf);
    setCity(cepData.cidade);
    setDistrict(cepData.bairro);
    setStreet(cepData.logradouro);

    setDistrictError(false);
    setStreetError(false);
    setLoadingCep(false);
  };

  /**
   * Função que verifica se o Text está vazio e então seta o erro como verdadeiro ou falso
   * @param {string} text Texto a ser verificado
   * @param {function} setError Função para definir erro
   * @returns Retorna false se o texto for inválido (vazio) ou true se for válido
   */
  const isEmpty = (text, setError) => {
    if (text.trim() == "") {
      setError(true);
      setLoadingModalVisible(false);
      return false;
    } else {
      setError(false);
      return true;
    }
  };

  /**
   * Foca no text input dado
   * @param {React.MutableRefObject<any>} ref Ref a ser focado
   */
  const focusNextRef = (ref) => {
    ref?.current.focus();
  };

  /**
   * Foca no text input dado
   * @param {object} ref Ref do text a ser focado
   */
  const focusNextState = (ref) => {
    ref?.getElement().focus();
  };

  return (
    <Background>
      <StatusBar backgroundColor="#27458b" barStyle="light-content" />
      <ScrollView>
        <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <GoBackButton navigation={navigation} />
          <Header>
            <Title>Insira seus Dados</Title>
          </Header>
          <Body>
            <InputSignup
              title="Nome"
              ref={nomeRef}
              placeholder="Nome Completo"
              value={nome}
              onChangeText={setNome}
              error={nomeError}
              onBlur={validNome}
              next={() => focusNextRef(emailRef)}
            />
            <InputSignup
              title="E-mail"
              ref={emailRef}
              placeholder="Seu melhor e-mail"
              value={email}
              onChangeText={setEmail}
              error={emailError}
              onBlur={validEmail}
              next={() => focusNextRef(passwordRef)}
            />
            <Row style={{ alignItems: "flex-end" }}>
              <InputSignup
                ref={passwordRef}
                title="Senha"
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                password={true}
                error={passwordError}
                width={50}
                next={() => focusNextRef(verifyPasswordRef)}
              />
              <InputSignup
                ref={verifyPasswordRef}
                title="Confirme sua senha"
                placeholder="Confirme sua senha"
                value={verifyPassword}
                width={50}
                onChangeText={setVerifyPassword}
                password={true}
                error={verifyPasswordError}
                onBlur={validPassword}
                next={() => focusNextState(cpfRef)}
              />
            </Row>
            <Row>
              <InputCPF
                cpfRef={setCpfRef}
                value={cpf}
                onChangeText={setCpf}
                error={cpfError}
                onBlur={validCPF}
                next={() => focusNextState(phoneRef)}
              />
              <InputPhone
                phoneRef={setPhoneRef}
                value={phone}
                onChangeText={setPhone}
                onBlur={validPhone}
                error={phoneError}
                next={() => focusNextState(cepRef)}
              />
            </Row>
            <Row>
              <InputZipCode
                cepRef={setCepRef}
                value={cep}
                onChangeText={setCep}
                error={cepError}
                onBlur={validCEP}
                next={Keyboard.dismiss}
              />
              <InputSignup
                value={uf}
                title="UF"
                placeholder="UF"
                width={30}
                editable={false}
              />
            </Row>
            {loadingCep ? (
              <LoadingCep>
                <ActivityIndicator color="#fff" size="large" />
                <LoadingCepText>Buscando informações</LoadingCepText>
              </LoadingCep>
            ) : (
              <>
                <Row>
                  <InputSignup
                    value={city}
                    title="Cidade"
                    placeholder="Cidade"
                    width={50}
                    editable={false}
                  />
                  <InputSignup
                    ref={districtRef}
                    title="Bairro"
                    placeholder="Bairro"
                    value={district}
                    onBlur={() => isEmpty(district, setDistrictError)}
                    error={districtError}
                    onChangeText={setDistrict}
                    width={50}
                    next={() => focusNextRef(streetRef)}
                  />
                </Row>
                <Row>
                  <InputSignup
                    ref={streetRef}
                    title="Rua"
                    placeholder="Rua"
                    value={street}
                    onBlur={() => isEmpty(street, setStreetError)}
                    error={streetError}
                    onChangeText={setStreet}
                    width={45}
                    next={() => focusNextRef(houseNumberRef)}
                  />
                  <InputSignup
                    ref={houseNumberRef}
                    title="Nº"
                    placeholder="Número"
                    value={houseNumber}
                    onChangeText={setHouseNumber}
                    error={houseNumberError}
                    onBlur={() => isEmpty(houseNumber, setHouseNumberError)}
                    width={22}
                    keyboardType="number-pad"
                    next={() => focusNextRef(houseCompRef)}
                  />
                  <InputSignup
                    ref={houseCompRef}
                    title="Comp."
                    placeholder="Complemento"
                    width={33}
                    value={houseComp}
                    onChangeText={setHouseComp}
                    error={houseCompError}
                    last={true}
                    next={Keyboard.dismiss}
                    blurSubmit={true}
                  />
                </Row>
              </>
            )}
          </Body>
          <Bottom>
            <Button onPress={handleSignup}>
              <TextButton>Registrar</TextButton>
            </Button>
          </Bottom>
        </Pressable>
      </ScrollView>
      <LoadingModal visible={loadingModalVisible} />
      <SuccessModal
        visible={successModalVisible}
        message={successModalMessage}
        onClose={handleCloseModalSuccess}
      />
      <ErrorModal
        visible={errorModalVisible}
        message={errorModalMessage}
        onClose={setErrorModalVisible}
      />
    </Background>
  );
};

export default AccountData;
