import React, { useEffect, useState } from "react";

import {
  StatusBar,
  Text,
  Alert,
  View,
  FlatList,
  Pressable,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import { TouchableOpacity as AnimatedTouchableOpacity } from "react-native-gesture-handler";

import { useSelector, useDispatch } from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";

import RegisterAgendaModal from "~components/Modals/RegisterAgenda";
import Background from "~components/Background";
import AgendaModal from "~components/Modals/Agenda";
import LoadingModal from "~components/Modals/Loading";
import AgendaButton from "~components/AgendaButton";
import AddAgendaButton from "~components/AddAgendaButton";

import { fazerLogout } from "~store/actions";
import { setUser } from "~store/actions";
import { user } from "~store/selectors";

import api from "~services/api";

import { createUser, createRealm } from "~Realm/Database";

import {
  Subtitle,
  Title,
  Container,
  Header,
  HeaderItemText,
  HeaderItem,
  CardView,
  WelcomeView,
  LogoutButtonText,
  LogoutButtonView,
} from "./style";
import { setAutoLogin } from "~store/autoLogin";

/**
 * Componente Home do Profissional
 * @returns Componente da Home do Profissional
 */
const Home = () => {
  const userData = useSelector(user);
  const dispatch = useDispatch();

  const [firstTime, setFirstTime] = useState(true);

  const [modalDados, setModalDados] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingModalVisible, setLoadingModal] = useState(false);

  const [registerAgendaVisible, setRegisterAgendaVisible] = useState(false);
  const [agendas, setAgendas] = useState([]);

  const [cadastradasFiltro, setCadastradasFiltro] = useState(true);
  const [canceladasFiltro, setCanceladasFiltro] = useState(true);
  const [atendidasFiltro, setAtendidasFiltro] = useState(true);

  const [opacityCadastradas, setOpacityCadastradas] = useState(false);
  const [opacityCanceladas, setOpacityCanceladas] = useState(false);
  const [opacityAtendidas, setOpacityAtendidas] = useState(false);

  const [cadastradas, setCadastradas] = useState(0);
  const [atendidas, setAtendidas] = useState(0);
  const [canceladas, setCanceladas] = useState(0);

  const [cadastradasDisabled, setCadastradasDisabled] = useState(false);
  const [atendidasDisabled, setAtendidasDisabled] = useState(false);
  const [canceladasDisabled, setCanceladasDisabled] = useState(false);

  useEffect(() => {
    Alert.alert("Escolha", `Deseja entrar como Profissional ou Cliente?`, [
      {
        text: "Profissional",
        onPress: () => {
          setLoadingModal(true);
          handleLogin("prof");
          createUser(userData.realmEmail).then(() => {
            createRealm(userData.realmId).then(() => refresh());
          });
        },
      },
      {
        text: "Cliente",
        onPress: () => handleLogin("clie"),
      },
    ]);
  }, []);

  /**
   * Chama um Alert para fazer a confirmação do LogOut do Aplicativo
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
   * Faz o LogIn do usuário, baseado no tipo de conta escolhida
   * @param {"clie" | "prof"} tipo Tipo de usuário a ser Logado
   */
  const handleLogin = async (tipo = "prof") => {
    try {
      await AsyncStorage.setItem("@tipo", tipo);
      const data = {
        TIPO: tipo,
        NOME: userData.nome,
        EMAIL: userData.email,
        error: false,
        ID: userData.id,
        REALM_ID: userData.realmId,
        REALM_EMAIL: userData.realmEmail,
      };
      dispatch(setUser(data));
    } catch (e) {
      console.log(e);
    }
  };

  /**
   * Chama funções de logout do usuário
   */
  const logout = async () => {
    removeUser();
    dispatch(fazerLogout());
    setAutoLogin({});
  };

  /**
   * Remoção do usuário do Async Storage
   */
  const removeUser = async () => {
    try {
      await AsyncStorage.removeItem("@tipo");
    } catch (e) {}
  };

  /**
   * @param {string} phrase
   * @returns Retorna a primeira palavra da String passada
   */
  const getFirstWord = (phrase) => {
    const indexFirtSpace = String(phrase).indexOf(" ");
    const word = String(phrase).substr(0, indexFirtSpace);
    if (word == "") return phrase;
    return word;
  };

  /**
   * Retorna a String passada, com a primeira letra capitalizada
   * @param {string} phrase String a ser capitalizada
   * @returns string
   */
  const capitalizeFirstLetter = (phrase) => {
    return phrase.charAt(0).toUpperCase() + phrase.slice(1);
  };

  /**
   * Recarrega a lista de agendas do banco
   * @param {boolean} showLoadingModal Define se vai mostrar o loading modal
   */
  const refresh = async (showLoadingModal = true) => {
    setLoadingModal(showLoadingModal);
    try {
      const { data } = await api.post("agenda/pegar_agenda.php", {
        profId: userData.id,
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
            listPostadas = listPostadas.concat({ dados: data[i] });
            if (listPostadas[postadas].dados.cliente == null)
              listPostadas[postadas].dados.cliente = undefined;
            postadas++;
            cadastradas++;
            break;
          case "agendada":
            listAgendadas = listAgendadas.concat({ dados: data[i] });
            cadastradas++;
            break;
          case "cancelada":
            listCanceladas = listCanceladas.concat({ dados: data[i] });
            canceladas++;
            break;
          case "atendida":
            listAtendidas = listAtendidas.concat({ dados: data[i] });
            atendidas++;
            break;
          case "aguardando confirmação de atendimento":
            listAguardando = listAguardando.concat({ dados: data[i] });
            cadastradas++;
            break;
        }
      }

      let listaDasAtendidas = [],
        listaDasAgendadas = [],
        listaDasAguardando = [],
        listaDasPostadas = [],
        listaDasCanceladas = [];

      if (atendidasFiltro && atendidas > 0) {
        listaDasAtendidas = listAtendidas;
        setOpacityAtendidas(true);
      } else setOpacityAtendidas(false);

      if (cadastradasFiltro && cadastradas > 0) {
        listaDasAgendadas = listAgendadas;
        setOpacityCadastradas(true);
        listaDasAguardando = listAguardando;
        listaDasPostadas = listPostadas;
      } else setOpacityCadastradas(false);

      if (canceladasFiltro && canceladas > 0) {
        listaDasCanceladas = listCanceladas;
        setOpacityCanceladas(true);
      } else setOpacityCanceladas(false);

      dados = dados.concat(
        listaDasAgendadas,
        listaDasPostadas,
        listaDasAtendidas,
        listaDasCanceladas,
        listaDasAguardando
      );
      setAtendidasDisabled(atendidas == 0);
      setCadastradasDisabled(cadastradas == 0);
      setCanceladasDisabled(canceladas == 0);

      setCadastradas(cadastradas);
      setCanceladas(canceladas);
      setAtendidas(atendidas);

      setAgendas(dados);
    } catch (e) {
      console.log(e);
    }

    setLoadingModal(false);
  };

  /**
   * Remove um horário de agenda do banco de dados
   * @param {{message: string, cancelar: boolean, id: string}} modalData Dados da agenda a ser removida
   */
  const removeModal = (modalData) => {
    Alert.alert(
      "Tem certeza?",
      `Você quer apagar este horário?\n${modalData.message}`,
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
     * Função para remover ou cancelar o modal
     * @param {{cancelar: boolean, id:string}} ModalDados dados do modal a ser cancelado ou removido
     */
    const remove = async ({ cancelar, id }) => {
      setLoadingModal(true);
      try {
        if (cancelar) {
          const { data } = await api.post("agenda/cancelar_agenda.php", {
            id: id,
          });
        } else {
          const { data } = await api.post("agenda/remover_agenda.php", {
            id: id,
          });
        }
        if (data.error) {
          Alert.alert("Erro", data.message);
        } else {
          refresh();
          setModalVisible(false);
        }
      } catch (e) {
        Alert.alert("Erro", "Não foi possível conectar-se com o servidor");
        setLoadingModal(false);
      }
    };
  };

  /**
   * Função chamada para confirmar o atendimento de uma agenda
   * @param {number} id ID da agenda
   */
  const onPressConfirmed = (id) => {
    Alert.alert(
      "Confirmar Atendimento",
      `Deseja confirmar o atendimento da agenda de ID: ${id}?`,
      [
        {
          text: "Sim",
          onPress: () => attendedAgenda(id),
        },
        {
          text: "Não",
          onPress: () => {},
        },
      ]
    );
  };

  /**
   * Conexão com banco de dados para confirmar atendimento de uma agenda
   * @param {number} id ID da agenda
   */
  const attendedAgenda = async (id) => {
    try {
      setLoadingModal(true);
      const { data } = await api.post("agenda/confirmar_atendimento.php", {
        id: id,
        tipo: "prof",
      });
      if (data.error) {
        Alert.alert("Erro", "Não foi possível conectar-se com o servidor");
      } else {
        refresh();
        setModalVisible(false);
      }
    } catch (e) {
      Alert.alert("Erro", "Não foi possível conectar-se com o servidor");
    }
  };

  useEffect(() => {
    if (!firstTime) refresh(false);
    else setFirstTime(false);
  }, [atendidasFiltro, canceladasFiltro, cadastradasFiltro]);

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
            <Subtitle>Agendas</Subtitle>
            <HeaderItem>
              <Pressable
                style={({ pressed }) => [
                  {
                    borderRadius: 5,
                    backgroundColor: pressed ? "#213A74" : "#213A92",
                    elevation: pressed ? 2 : 5,
                    opacity: opacityCadastradas ? 1 : 0.5,
                  },
                ]}
                onPress={() => setCadastradasFiltro((state) => !state)}
                disabled={cadastradasDisabled}
              >
                <HeaderItemText>
                  Cadastradas:{`\n${cadastradas}`}
                </HeaderItemText>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  {
                    borderRadius: 5,
                    backgroundColor: pressed ? "#213A74" : "#213A92",
                    elevation: pressed ? 2 : 5,
                    opacity: opacityAtendidas ? 1 : 0.5,
                  },
                ]}
                onPress={() => setAtendidasFiltro((state) => !state)}
                disabled={atendidasDisabled}
              >
                <HeaderItemText>Atendidas:{`\n${atendidas}`}</HeaderItemText>
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
                <HeaderItemText>Canceladas:{`\n${canceladas}`}</HeaderItemText>
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
            ListHeaderComponent={() => (
              <AddAgendaButton
                setVisible={setRegisterAgendaVisible}
                color={"#1D349A"}
              />
            )}
            keyExtractor={({ dados }) => dados.id}
          />
        </CardView>
      </Container>
      <RegisterAgendaModal
        refresh={refresh}
        visible={registerAgendaVisible}
        onClose={() => setRegisterAgendaVisible(false)}
        dados={[
          {
            icone: "cog",
            id: 1,
            categoria: "Reparos",
          },
          {
            icone: "plug",
            id: 2,
            categoria: "Assist. Técnica",
          },
          {
            icone: "graduation-cap",
            id: 3,
            categoria: "Aulas",
          },
          {
            icone: "car",
            id: 4,
            categoria: "Autos",
          },
          {
            icone: "comments",
            id: 5,
            categoria: "Consultoria",
          },
          {
            icone: "comments",
            id: 6,
            categoria: "Alguma coisa",
          },
          {
            icone: "comments",
            id: 7,
            categoria: "Outra coisa",
          },
        ]}
      />
      <LoadingModal visible={loadingModalVisible} />
      <AgendaModal
        onPressConfirmed={onPressConfirmed}
        visible={modalVisible}
        onPressConfirm={setModalVisible}
        onPressCancel={(data) => removeModal(data)}
        dados={modalDados}
      />
    </Background>
  );
};

export default Home;
