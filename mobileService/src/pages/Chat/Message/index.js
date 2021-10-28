import React, { useState, useCallback, useEffect } from "react";

import { GiftedChat } from "react-native-gifted-chat";

import { useSelector } from "react-redux";

import Background from "~components/Background";
import GoBackButton from "~components/GoBackButton";
import LoadingModal from "~components/Modals/Loading";

import { user } from "~store/selectors";

import {
  createMessage,
  setTempRealmUser,
  createRealmListener,
} from "~Realm/Database";

import { ContactText, Header } from "./style";

export default function Message({ navigation, route }) {
  const [messages, setMessages] = useState([]);
  const contact = route.params.contato;
  const contactEmail = route.params.emailContato;
  const userData = useSelector(user);

  const [loadingVisible, setLoadingVisible] = useState(true);

  /**
   * Pega a primeira palavra de uma frase
   * @param {string} phrase Frase a ser pega a primeira palavra
   * @returns primeira palavra
   */
  const getFirstWord = (phrase) => {
    const indexFirtSpace = String(phrase).indexOf(" ");
    return String(phrase).substr(0, indexFirtSpace);
  };
  const contactName = getFirstWord(contact);

  /**
   * carregar as mensagens, criar usuario do Realm do contato, criar realm
   * e pegar mensagens
   */
  useEffect(() => {
    try {
      setTempRealmUser(contactEmail).then(() => {
        createRealmListener(setMessages);
        setLoadingVisible(false);
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  /**
   * função de envio de mensagem para enviar para o banco a mensagem
   */
  const onSend = useCallback((message = []) => {
    try {
      createMessage(message[0]._id, contact, message[0].text, userData.nome);
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <Background>
      <Header>
        <GoBackButton
          onPress={() => {
            navigation.goBack();
          }}
          navigation={navigation}
          showText={false}
          color="#fffaff"
        />
        <ContactText>{contactName}</ContactText>
      </Header>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userData.realmId,
          name: userData.nome,
        }}
      />
      <LoadingModal visible={loadingVisible} />
    </Background>
  );
}
