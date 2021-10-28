import React, { useRef, useState, useEffect } from "react";

import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";

import IconC from "react-native-vector-icons/MaterialCommunityIcons";

import { useSelector, useDispatch } from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { setUser } from "~store/actions";
import { user } from "~store/selectors";

import api from "~services/api";

import InputSignup from "~components/InputSignup";
import InputCPF from "~components/MaskedInputs/InputCPF";
import InputZipCode from "~components/MaskedInputs/InputZipCode";
import InputPhone from "~components/MaskedInputs/InputPhone";
import ErrorModal from "~components/Modals/ErrorModal";
import SuccessModal from "~components/Modals/Success";
import LoadingModal from "~components/Modals/Loading";

import {
  Title,
  Header,
  Button,
  TextButton,
  LoadingDataContainer,
  LoadingCepContainer,
  LoadingCepText,
  LoadingDataText,
  Row,
  Bottom,
  FormContainer,
} from "./style";

export default Config = () => {
  const dispatch = useDispatch();
  const [loadingData, setLoadingData] = useState(true);

  const [nome, setNome] = useState("");
  const [nomeError, setNomeError] = useState(false);
  const nomeRef = useRef(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const emailRef = useRef(null);

  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [uf, setUf] = useState("");
  const [city, setCity] = useState("");

  const [cep, setCep] = useState("");
  const [cepError, setCepError] = useState(false);
  const [cepRef, setCepRef] = useState({});

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [phoneRef, setPhoneRef] = useState({});

  const [district, setDistrict] = useState("");
  const districtRef = useRef(null);
  const [districtError, setDistrictError] = useState(false);

  const [street, setStreet] = useState("");
  const streetRef = useRef(null);
  const [streetError, setStreetError] = useState(false);

  const [houseNumber, setHouseNumber] = useState("");
  const houseNumberRef = useRef(null);
  const [houseNumberError, setHouseNumberError] = useState(false);

  const [houseComp, setHouseComp] = useState("");
  const houseCompRef = useRef(null);
  const [houseCompError, setHouseCompError] = useState(false);

  const [loadingCep, setLoadingCep] = useState(false);

  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");

  const [successModalMessage, setSuccessModalMessage] = useState("");
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const userData = useSelector(user);

  useEffect(() => {
    getUser();
  }, []);

  /**
   * pega dados do usuário e preenche os inputs
   */
  const getUser = async () => {
    try {
      const { data } = await api.post(`config/get_info.php`, {
        ID: userData.id,
      });
      setNome(data.NOME);
      setEmail(data.EMAIL);
      setPhone(`${data.DDD_TELEFONE}${data.TELEFONE}`);
      setCep(data.CEP);
      setUf(data.UF);
      setCpf(data.CPF);
      setCity(data.CIDADE);
      setDistrict(data.BAIRRO);
      setStreet(data.RUA);
      setHouseNumber(data.END_NUMERO);
      setHouseComp(data.END_COMPLEMENTO);
      setPassword(data.SENHA);
      setLoadingData(false);
    } catch (e) {}
  };

  /**
   * Valida se o email é válido
   * @param {boolean} focusInput Se é necessário focar no input se estiver errado
   * @returns Se o email é válido ou não
   */
  const validEmail = (focusInput = false) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)) {
      setEmailError(true);
      focusInput && emailRef.current?.focus();
      return false;
    } else {
      setEmailError(false);
      return true;
    }
  };

  /**
   * verifica se o email não está vazio e se tem 11/10 dígitos
   * @param {boolean} focusInput Se é necessário focar no input se estiver errado
   * @returns
   */
  const validPhone = (focusInput = false) => {
    if (!(phone.length == 11 || phone.length == 10)) {
      focusInput && phoneRef.getElement().focus();
      setPhoneError(true);
      return false;
    } else {
      setPhoneError(false);
      return true;
    }
  };

  /**
   * verifica o cep para autopreencher os campos de endereço
   * @returns se o cep é válido ou não
   */
  const validCep = async () => {
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
   * preenche os campos de endereço
   * @param {{uf:string,cidade:string,bairro:string,logradouro:string}} cepData Dados do cep
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
   * Função para verificar se um texto está vazio e acionar o erro se for
   * @param {string} text texto a ser verificado
   * @param {React.Dispatch<React.SetStateAction<boolean>>} setError Setter para definir o erro
   * @returns Se o texto é válido ou não
   */
  const isEmpty = (text, setError) => {
    if (text.trim() == "") {
      setError(true);
      return false;
    } else {
      setError(false);
      return true;
    }
  };

  /**
   * Foca no input dado
   * @param {React.MutableRefObject<any>} ref input a ser focado
   */
  const focusNextRef = (ref) => {
    ref?.current.focus();
  };

  /**
   * Foca no input dado
   * @param {object} ref input a ser focado
   */
  const focusNextState = (ref) => {
    ref?.getElement().focus();
  };

  /**
   * Verifica todos campos e então direciona para alteração de dados
   */
  const handleSignup = () => {
    Keyboard.dismiss();
    setLoadingModalVisible(true);
    switch (false) {
      case isEmpty(nome, setNomeError):
        Alert.alert("Erro", "Nome inválido");
        break;
      case validEmail(true):
        Alert.alert("Erro", "E-mail inválido");
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

      default:
        changeUser();
        break;
    }

    setLoadingModalVisible(false);
  };

  /**
   * altera os dados do usuário
   */
  const changeUser = async () => {
    setLoadingModalVisible(true);
    try {
      const { data } = await api.post("config/alt_dados.php", {
        nome: nome,
        email: email,
        telefone: phone,
        cep: cep,
        uf: uf,
        cidade: city,
        bairro: district,
        rua: street,
        end_numero: houseNumber,
        end_complemento: houseComp,
        id: userData.id,
      });
      if (data.error) {
        setErrorModalVisible(true);
        setErrorModalMessage(data.message);
      } else {
        data.dados.TIPO = userData.tipo;
        storageUserRole(userData.tipo); /**Mudar aqui */
        dispatch(setUser(data.dados));
        setSuccessModalMessage(data.message);
        setSuccessModalVisible(true);
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
   * Altera função selecionada pelo usuário no Async Storage
   * @param {"prof" | "clie"} userRole Tipo de conta selecionada pelo usuário
   */
  const storageUserRole = async (userRole) => {
    try {
      await AsyncStorage.setItem("@tipo", userRole);
    } catch (e) {}
  };

  /**
   * Mensagem informativa de onde trocar a sua senha
   */
  const passwordInfo = () => {
    Alert.alert(
      "Troca de senha",
      'Para a sua segurança\nPara trocar sua senha, vá até a tela de Login e clique em "Esqueceu sua senha?"'
    );
  };

  return (
    <Background>
      <Header
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.29,
          shadowRadius: 4.65,

          elevation: 7,
        }}
      >
        <Title> Edite seus Dados</Title>
      </Header>
      <ScrollView>
        <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          {loadingData ? (
            <LoadingDataContainer>
              <ActivityIndicator color="#fffafa" size="large" />
              <LoadingDataText>
                {"\n"} Carregando dados{"\n"}
                Aguarde um momento
              </LoadingDataText>
            </LoadingDataContainer>
          ) : (
            <>
              <FormContainer>
                <InputSignup
                  title="Nome"
                  value={nome}
                  onChangeText={setNome}
                  error={nomeError}
                  onBlur={() => isEmpty(nome, setNomeError)}
                  ref={nomeRef}
                  next={() => focusNextRef(emailRef)}
                  placeholder="Nome"
                />
                <InputSignup
                  title="E-mail"
                  value={email}
                  onChangeText={setEmail}
                  error={emailError}
                  onBlur={validEmail}
                  ref={emailRef}
                  next={() => focusNextState(phoneRef)}
                  placeholder="Email"
                />
                <Row>
                  <InputSignup
                    title="Senha"
                    value={password}
                    width={40}
                    password={true}
                    editable={false}
                  />
                  <TouchableOpacity onPress={() => passwordInfo()}>
                    <IconC
                      style={{
                        top: 48,
                      }}
                      name="information"
                      size={35}
                      color="#fffafa"
                    />
                  </TouchableOpacity>
                  <InputCPF value={cpf} editable={false} />
                </Row>
                <Row>
                  <InputPhone
                    alt={true}
                    phoneRef={setPhoneRef}
                    value={phone}
                    onChangeText={setPhone}
                    onBlur={validPhone}
                    error={phoneError}
                    next={() => focusNextState(cepRef)}
                  />
                  <InputZipCode
                    cepRef={setCepRef}
                    value={cep}
                    onChangeText={setCep}
                    error={cepError}
                    onBlur={validCep}
                    next={Keyboard.dismiss}
                    width="35%"
                  />
                  <InputSignup
                    value={uf}
                    title="UF"
                    width={15}
                    editable={false}
                    placeholder="UF"
                  />
                </Row>
                {loadingCep ? (
                  <LoadingCepContainer>
                    <ActivityIndicator color="#fff" size="large" />
                    <LoadingCepText>Buscando informações</LoadingCepText>
                  </LoadingCepContainer>
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
              </FormContainer>
              <Bottom>
                <Button onPress={handleSignup}>
                  <TextButton>Alterar</TextButton>
                </Button>
              </Bottom>
            </>
          )}
        </Pressable>
      </ScrollView>
      <LoadingModal visible={loadingModalVisible} />
      <SuccessModal
        visible={successModalVisible}
        message={successModalMessage}
        onClose={setSuccessModalVisible}
      />
      <ErrorModal
        visible={errorModalVisible}
        message={errorModalMessage}
        onClose={setErrorModalVisible}
      />
    </Background>
  );
};
