import React, { useEffect, useState } from "react";

import {
  StatusBar,
  View,
  Alert,
  FlatList,
  Text,
  Pressable,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Icon from "react-native-vector-icons/Ionicons";

import { BSON } from "realm";

import "react-native-get-random-values";

import { TouchableOpacity as AnimatedTouchableOpacity } from "react-native-gesture-handler";

import { fazerLogout } from "~store/actions";
import { user } from "~store/selectors";

import Background from "~components/Background";
import AgendaButton from "~components/AgendaButton";
import AgendaModal from "~components/Modals/Agenda";
import LoadingModal from "~components/Modals/Loading";

import api from "~services/api";

import { createUser, createRealm, createContact } from "~Realm/Database";

import {
  Title,
  LogoutButtonView,
  LogoutButtonText,
  Header,
  Container,
  Subtitle,
  HeaderItem,
  HeaderItemText,
  WelcomeView,
  CardView,
} from "./style";
import { setAutoLogin } from "~store/autoLogin";

export default Home = () => {
  const userData = useSelector(user);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [concluidas, setConcluidas] = useState(0);
  const [canceladas, setCanceladas] = useState(0);
  const [emAberto, setEmAberto] = useState(0);

  const [firstTime, setFirstTime] = useState(true);

  const [emAbertoFiltro, setEmAbertoFiltro] = useState(true);
  const [canceladasFiltro, setCanceladasFiltro] = useState(true);
  const [concluidasFiltro, setconcluidasFiltro] = useState(true);

  const [opacityEmAberto, setOpacityEmAberto] = useState(false);
  const [opacityCanceladas, setOpacityCanceladas] = useState(false);
  const [opacityConcluidas, setOpacityConcluidas] = useState(false);

  const [emAbertoDisabled, setEmAbertoDisabled] = useState(false);
  const [concluidasDisabled, setConcluidasDisabled] = useState(false);
  const [canceladasDisabled, setCanceladasDisabled] = useState(false);

  const [agendas, setAgendas] = useState([]);
  const [modalDados, setModalDados] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    setLoadingModalVisible(true);
    createUser(userData.realmEmail).then(() => {
      createRealm().then(() => refresh());
    });
  }, []);

  /**
   * confirma se quer fazer o logout
   */
  const handleLogout = () => {
    Alert.alert("Sair", `Deseja sair da aplicação?`, [
      { text: "Não" },
      {
        text: "Sim",
        onPress: logout,
      },
    ]);
  };

  /**
   * Alert para confirmar esse horário
   * @param {string} message Mensagem a ser exibida no alerta
   * @param {string} id OID da agenda
   * @param {string} clienteId realmId do cliente
   * @param {string} clienteName Nome do cliente
   * @param {string} profEmail email do profissional
   * @param {string} profName Nome do profissional
   */
  const onPressAgend = (
    message,
    id,
    clienteId,
    clienteName,
    profEmail,
    profName
  ) => {
    Alert.alert("Confirmar horário", message, [
      {
        text: "Sim",
        onPress: () => {
          marcarAgenda(id, clienteId, clienteName, profEmail, profName);
        },
      },
      {
        text: "Não",
        onPress: () => {},
      },
    ]);
  };

  /**
   * Função para marcar horário no banco de dados
   * @param {string} id OID da agenda
   * @param {string} clieId realmId do cliente
   * @param {string} clieName Nome do cliente
   * @param {string} profEmail Email do profissional
   * @param {string} profNome Nome do profissional
   */
  const marcarAgenda = async (id, clieId, clieName, profEmail, profNome) => {
    try {
      setLoadingModalVisible(true);
      const { data } = await api.post("agenda/marcar_atendimento.php", {
        id: id,
        clienteId: clieId,
        clienteName: clieName,
      });
      if (data.error) {
        Alert.alert("Erro", "Não foi possível conectar-se com o servidor");
      } else {
        createContact(new BSON.ObjectID(), profEmail, userData.nome, profNome);
        Alert.alert(
          "Horário marcado com sucesso!",
          "Vá até a aba de conversas e inicie uma conversa"
        );
        refresh();
        setModalVisible(false);
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Erro", "Não foi possível conectar-se com o servidor");
      setLoadingModalVisible(false);
    }
  };

  /**
   * Recarrega lista de agendas
   * @param {boolean} showLoadingModal Define se vai mostrar o loading modal
   */
  const refresh = async (showLoadingModal = true) => {
    setLoadingModalVisible(showLoadingModal);
    try {
      const { data } = await api.post("agenda/pegar_agenda.php", {
        profId: null,
      });
      let postadas = 0,
        atendidas = 0,
        canceladas = 0,
        cadastradas = 0;
      let listAtendidas = [],
        dados = [],
        listAgendadas = [],
        listPostadas = [],
        listCanceladas = [],
        listAguardando = [];
      for (let i = 0; i < data.length; i++) {
        switch (data[i].type) {
          case "postada":
            if (data[i].profEmail != userData.realmEmail) {
              listPostadas = listPostadas.concat({ dados: data[i] });
              if (listPostadas[postadas].dados.cliente == null)
                listPostadas[postadas].dados.cliente = undefined;
              postadas++;
            }
            break;
          case "agendada":
            if (data[i].clienteId == userData.id) {
              listAgendadas = listAgendadas.concat({ dados: data[i] });
              cadastradas++;
            }
            break;
          case "cancelada":
            if (data[i].clienteId == userData.id) {
              listCanceladas = listCanceladas.concat({ dados: data[i] });
              canceladas++;
            }
            break;
          case "atendida":
            if (data[i].clienteId == userData.id) {
              listAtendidas = listAtendidas.concat({ dados: data[i] });
              atendidas++;
            }
            break;
          case "aguardando confirmação de atendimento":
            if (data[i].clienteId == userData.id) {
              listAguardando = listAguardando.concat({ dados: data[i] });
              cadastradas++;
            }
            break;
        }
      }

      let listDasAgendadas = [],
        listDasAguardando = [],
        listDasAtendidas = [],
        listDasCanceladas = [];

      if (concluidasFiltro && atendidas > 0) {
        listDasAtendidas = listAtendidas;
        setOpacityConcluidas(true);
      } else setOpacityConcluidas(false);

      if (emAbertoFiltro && cadastradas > 0) {
        listDasAgendadas = listAgendadas;
        setOpacityEmAberto(true);
        listDasAguardando = listAguardando;
      } else setOpacityEmAberto(false);

      if (canceladasFiltro && canceladas > 0) {
        listDasCanceladas = listCanceladas;
        setOpacityCanceladas(true);
      } else setOpacityCanceladas(false);

      dados = dados.concat(
        listDasAgendadas,
        listDasAguardando,
        listPostadas,
        listDasCanceladas,
        listDasAtendidas
      );

      setEmAbertoDisabled(cadastradas == 0);
      setConcluidasDisabled(atendidas == 0);
      setCanceladasDisabled(canceladas == 0);

      setEmAberto(cadastradas);
      setCanceladas(canceladas);
      setConcluidas(atendidas);
      setAgendas(dados);
    } catch (e) {
      console.log(e);
    }
    setLoadingModalVisible(false);
  };

  /**
   * Faz a primeira letra ficar maiuscula
   * @param {string} phrase Frase a ser capitalizada
   * @returns Frase com a primeira letra maiúscula
   */
  const capitalizeFirstLetter = (phrase) => {
    return phrase.charAt(0).toUpperCase() + phrase.slice(1);
  };

  /**
   * Confirma o atendimento da agenda
   * @param {string} id OID da agenda
   */
  const attendedAgenda = async (id) => {
    try {
      setLoadingModalVisible(true);
      const { data } = await api.post("agenda/confirmar_atendimento.php", {
        id: id,
        tipo: "clie",
      });
      if (data.error) {
        Alert.alert("Erro", "Não foi possível conectar-se com o servidor");
      } else {
        refresh();
        setModalVisible(false);
      }
    } catch (e) {
      setLoadingModalVisible(false);
      console.log(e);
      Alert.alert("Erro", "Não foi possível conectar-se com o servidor");
    }
  };

  /**
   * Procedimentos de logout
   */
  const logout = () => {
    removeUser();
    dispatch(fazerLogout());
    setAutoLogin({});
  };

  /**
   * remover usuário do Async Storage
   */
  const removeUser = async () => {
    try {
      await AsyncStorage.removeItem("@tipo");
    } catch (e) {
      console.log(e);
    }
  };

  /**
   * pegar primeira palavra de uma string
   * @param {string} phrase Frase a ser pega a primeira palavra
   * @returns primeira palavra da frase
   */
  const getFirstWord = (phrase) => {
    const indexFirtSpace = String(phrase).indexOf(" ");

    if (String(phrase).substr(0, indexFirtSpace).trim() == "") {
      return phrase;
    } else return String(phrase).substr(0, indexFirtSpace);
  };

  /**
   * Função de deletar Modal
   * @param {{message:string, id:string}} modalData
   */
  const removeModal = (modalData) => {
    Alert.alert(
      "Tem certeza?",
      `Você quer mesmo cancelar este horário?\n${modalData.message}`,
      [
        {
          text: "Sim",
          onPress: () => remove(modalData),
        },
        {
          text: "Não",
        },
      ]
    );

    /**
     *
     * @param {{id:string}} dados
     */
    const remove = async (dados) => {
      setLoadingModalVisible(true);
      try {
        const { data } = await api.post("agenda/cancelar_agenda.php", {
          id: dados.id,
        });
        if (data.error) {
          Alert.alert("Erro", data.message);
        } else
          refresh().then(() => {
            setLoadingModalVisible(false);
            setModalVisible(false);
          });
      } catch (e) {
        Alert.alert("Erro", "Não foi possível conectar-se com o servidor");
        setLoadingModalVisible(false);
      }
    };
  };

  /**
   * Botão para confirmar atendimento
   * @param {string} id OID da agenda
   */
  const onPressConfirmed = (id) => {
    Alert.alert(
      "Confirmar Atendimento",
      `Deseja confirmar o atendimento da agenda de ID: ${id}?`,
      [
        {
          text: "Sim",
          onPress: () => {
            attendedAgenda(id);
          },
        },
        {
          text: "Não",
          onPress: () => {},
        },
      ]
    );
  };

  useEffect(() => {
    if (!firstTime) refresh(false);
    else setFirstTime(false);
  }, [concluidasFiltro, canceladasFiltro, emAbertoFiltro]);

  return (
    <Background color="#213A74">
      <StatusBar backgroundColor="#213A74" barStyle="light-content" />
      <Container>
        <Header>
          <WelcomeView>
            <Title>
              Bem-Vindo {capitalizeFirstLetter(getFirstWord(userData.nome))}
            </Title>
          </WelcomeView>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Subtitle>{userData.email}</Subtitle>
            <HeaderItem>
              <Pressable
                style={({ pressed }) => [
                  {
                    borderRadius: 5,
                    backgroundColor: pressed ? "#213A74" : "#213A92",
                    elevation: pressed ? 2 : 5,
                    opacity: opacityEmAberto ? 1 : 0.5,
                  },
                ]}
                onPress={() => setEmAbertoFiltro((state) => !state)}
                disabled={emAbertoDisabled}
              >
                <HeaderItemText>Em aberto:{"\n" + emAberto}</HeaderItemText>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  {
                    borderRadius: 5,
                    backgroundColor: pressed ? "#213A74" : "#213A92",
                    elevation: pressed ? 2 : 5,
                    opacity: opacityConcluidas ? 1 : 0.5,
                  },
                ]}
                onPress={() => setconcluidasFiltro((state) => !state)}
                disabled={concluidasDisabled}
              >
                <HeaderItemText>Concluídos:{"\n" + concluidas}</HeaderItemText>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  {
                    borderRadius: 5,
                    backgroundColor: pressed ? "#213A74" : "#213A92",
                    elevation: pressed ? 2 : 5,
                    opacity: opacityCanceladas ? 1 : 0.5,
                  },
                ]}
                onPress={() => setCanceladasFiltro((state) => !state)}
                disabled={canceladasDisabled}
              >
                <HeaderItemText>Cancelados:{"\n" + canceladas}</HeaderItemText>
              </Pressable>
            </HeaderItem>
            <LogoutButtonView>
              <AnimatedTouchableOpacity
                onPress={handleLogout}
                style={{ flexDirection: "row" }}
              >
                <Icon
                  style={{ color: "#fff", paddingRight: 5 }}
                  size={20}
                  name="ios-exit-outline"
                />
                <LogoutButtonText>Sair</LogoutButtonText>
              </AnimatedTouchableOpacity>
            </LogoutButtonView>
          </View>
        </Header>
        <CardView>
          <FlatList
            data={agendas}
            ListEmptyComponent={
              <View style={{ justifyContent: "center", paddingTop: 30 }}>
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: "Montserrat-SemiBold",
                    fontSize: 14,
                    color: "#000",
                  }}
                >
                  {"Nenhum horário encontrado.\nTente novamente mais tarde!"}
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <AgendaButton
                agendaData={item.dados}
                setDados={setModalDados}
                setVisible={setModalVisible}
              />
            )}
            ListFooterComponent={() => (
              <View>
                <Text></Text>
              </View>
            )}
            keyExtractor={({ dados }) => dados.id}
          />
        </CardView>
      </Container>
      <AgendaModal
        onPressConfirmed={onPressConfirmed}
        visible={modalVisible}
        onPressConfirm={setModalVisible}
        onPressCancel={(data) => removeModal(data)}
        dados={modalDados}
        onPressAgend={onPressAgend}
      />
      <LoadingModal visible={loadingModalVisible} />
    </Background>
  );
};
