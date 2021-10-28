import React, { useState, useRef } from "react";

import { Alert, Keyboard, ScrollView, View } from "react-native";

import { useSelector } from "react-redux";

import api from "~services/api";

import CategoryList from "~components/CategoryList";
import InputDate from "~components/MaskedInputs/InputDate";
import SuccessModal from "~components/Modals/Success";
import ErrorModal from "~components/Modals/ErrorModal";
import LoadingModal from "~components/Modals/Loading";

import { user } from "~store/selectors";

import {
  CenteredText,
  ConfirmButton,
  ConfirmTextButton,
  Container,
  Footer,
  Header,
  HeaderArea,
  InputDateArea,
  ObsTextInput,
  ProfInputArea,
  ProfText,
  ProfTextInput,
} from "./style";

const AddAgendaDadosScreen = ({ dados, onClose, refresh }) => {
  const userData = useSelector(user);
  const [prof, setProf] = useState("");
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("");
  const [obs, setObs] = useState("");

  const [dayRef, setDayRef] = useState({});
  const [hourRef, setHourRef] = useState({});
  const obsRef = useRef(null);

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState("");

  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  const [profError, setProfError] = useState(false);
  const [dayError, setDayError] = useState(false);
  const [hourError, setHourError] = useState(false);
  /**
   * Verifica se os dados da agenda são válidos e então faz a conexão com o Banco
   * @param {object} AgendaData Objeto com dados da Agenda
   */
  const createAgenda = async ({ hour, day, obs = "", prof }) => {
    switch (false) {
      case isEmpty(prof, setProfError):
        Alert.alert("Erro", "Profissão inválida");
        break;
      case isEmpty(hour, setHourError, 5):
        Alert.alert("Erro", "Hora inválida");
        break;
      case isEmpty(day, setDayError, 10):
        Alert.alert("Erro", "Data inválida");
        break;
      case isValidDay(day, hour):
        Alert.alert("Erro", "Data ou hora inválida(s)");
        break;
      default:
        setLoadingModalVisible(true);
        try {
          const { data } = await api.post("agenda/cadastra_agenda.php", {
            profId: new Number(userData.id),
            categoria: dados.categoria,
            clienteId: null,
            obs: obs,
            prof: prof,
            dia: day,
            hora: hour,
            status: "postada",
          });
          if (data.error) {
            setErrorModalMessage(data.message);
            setErrorModalVisible(true);
          } else {
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

        break;
    }
  };

  /**
   * Função para verificar se o dia existe no calendário gregoriano
   * @param {string} data String com o dia
   * @returns Boolean, baseado em se o dia é válido ou não
   */
  const dayExists = (data) => {
    let [month, day] = [data.slice(3, 5), data.slice(0, 2)];
    let qtdDias;
    month == 2
      ? (qtdDias = 28)
      : month % 2 == 1
      ? (qtdDias = 31)
      : (qtdDias = 30);

    if (month >= 1 && month <= 12 && day >= 1 && day <= qtdDias) {
      return true;
    } else return false;
  };

  /**
   * Função para verificar se
   * @param {string} hour Hora a ser verificada, em String
   * @returns Boolean, baseado na validade do horário
   */
  const hourExists = (hour) => {
    const [hours, minutes] = [hour.slice(0, 2), hour.slice(3, 5)];
    if (hours >= 24 || hours < 0 || minutes >= 60 || minutes < 0) return false;
    return true;
  };

  const isValidDay = (data, hora) => {
    if (dayExists(data) && hourExists(hour)) {
      //mes, dia, ano, minutos e horas indicam a data atual no sistema
      //month, day, year, hours e minutes indicam a data do agendamento

      const date = new Date();
      const [mes, dia, ano] = [
        date.getMonth() + 1,
        date.getDate(),
        date.getFullYear(),
      ];

      let [month, day, year] = [
        data.slice(3, 5),
        data.slice(0, 2),
        data.slice(6, 10),
      ];

      if (year >= ano) {
        //veririca se ano não passou já
        if (month >= mes) {
          if ((day >= dia && month == mes && year == ano) || month > mes) {
            //verifica primeiro se mês e dia ainda não foram no ano atual
            const [horas, minutos] = [date.getHours(), date.getMinutes()];
            const [hours, minutes] = [hora.slice(0, 2), hora.slice(3, 5)];
            if (month == mes && day == dia) {
              //se dia e mês forem HOJE, verifica hora
              return hours >= horas && minutes > minutos;
            } else {
              return true;
            }
          } else if (year <= ano + 2 && year > ano) {
            return true;
          }
        } else if (year <= ano + 2 && year > ano) {
          //verifica se (ano não é maior que daqui 2 anos e não é este ano)
          return true;
        }
      }
    }
    return false;
  };

  /**
   * Função para verificar se texto está vazio, se estiver ativa o SetERROR
   * @param {string} text Texto a ser verficado
   * @param {function} setError Função para setar erro se retornar true
   * @param {number} length tamanho esperado do texto, se houver
   * @returns Boolea
   */
  const isEmpty = (text, setError, length = text.length) => {
    if (text.trim() == "" || length != text.length) {
      setError(true);
      return false;
    } else {
      setError(false);
      return true;
    }
  };

  /**
   * Foca no elemento State, passado no parametro
   * @param {object} focus Ref do elemento a ser focado
   */
  const nextInputState = (focus) => {
    focus?.getElement().focus();
  };

  /**
   * Foca no Text Input do Ref passado no parametro
   * @param {React.MutableRefObject<any>} focus Ref do elemento a ser focado
   */
  const nextInputRef = (focus) => {
    focus?.current.focus();
  };

  return (
    <Container>
      <ScrollView>
        <Header>
          <CategoryList primeiro={dados} disable={true} />
          <ProfInputArea>
            <ProfText>Escreva sua profissão</ProfText>
            <ProfTextInput
              blurOnSubmit={false}
              value={prof}
              error={profError}
              onChangeText={setProf}
              onSubmitEditing={() => {
                nextInputRef(obsRef);
                isEmpty(prof, setProfError);
              }}
              returnKeyType="go"
              placeholder="Ex: Eletricista"
            />
          </ProfInputArea>
        </Header>
        <View>
          <HeaderArea>
            <CenteredText>
              Alguma observação ou comentário sobre seu trabalho? Escreva-o
              abaixo
            </CenteredText>
            <ObsTextInput
              value={obs}
              onChangeText={setObs}
              ref={obsRef}
              multiline={true}
              numberOfLines={5}
              placeholder="Observação"
              maxLength={100}
            />
          </HeaderArea>
          <HeaderArea>
            <CenteredText>
              Para quando você quer marcar esse horário?
            </CenteredText>
            <InputDateArea>
              <InputDate
                value={day}
                onChangeText={setDay}
                onSubmitEditing={() => {
                  nextInputState(hourRef);
                  isEmpty(day, setDayError, 10);
                }}
                erro={dayError}
                ref={setDayRef}
                day={true}
              />
              <InputDate
                value={hour}
                onChangeText={setHour}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                  isEmpty(hour, setHourError, 5);
                }}
                erro={hourError}
                ref={setHourRef}
                day={false}
              />
            </InputDateArea>
          </HeaderArea>
        </View>
        <Footer>
          <ConfirmButton
            onPress={() =>
              createAgenda({
                hour: hour,
                day: day,
                obs: obs.trim(),
                prof: prof,
              })
            }
          >
            <ConfirmTextButton>Ok</ConfirmTextButton>
          </ConfirmButton>
        </Footer>
      </ScrollView>
      <LoadingModal visible={loadingModalVisible} />
      <ErrorModal
        onClose={() => {
          setErrorModalVisible(false);
        }}
        message={errorModalMessage}
        visible={errorModalVisible}
      />
      <SuccessModal
        onClose={() => {
          setSuccessModalVisible(false);
          onClose();
          refresh();
        }}
        message={successModalMessage}
        visible={successModalVisible}
      />
    </Container>
  );
};

export default AddAgendaDadosScreen;
