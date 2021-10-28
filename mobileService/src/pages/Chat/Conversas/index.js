import React, { useState, useEffect } from "react";

import { FlatList } from "react-native";

import Background from "~components/Background";
import ContactList from "~components/ContactList";
import EmptyContactList from "~components/EmptyContactList";
import LoadingModal from "~components/Modals/Loading";

import { getContacts, setarSetContact, sortByDate } from "~Realm/Database";

import { Title, Header } from "./style";

const Message = ({ navigation }) => {
  const [contatos, setContatos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.getParent().addListener("tabPress", () => {
      puxarContatos();
    });

    return unsubscribe;
  }, [navigation]);

  /**
   * Direciona o usuário para o chat com as informações do contato
   * @param {{nome:string, email:string}} usuario dados do usuário
   */
  const handleChat = (usuario) => {
    navigation.navigate("Message", {
      contato: usuario.nome,
      emailContato: usuario.email,
    });
  };

  //Cria o Realm e pega todos contatos do usuário
  useEffect(() => {
    setarSetContact(setContatos);
    puxarContatos();
  }, []);

  /**
   * Puxa os contatos do Realm e coloca na lista
   */
  const puxarContatos = () => {
    const lista = getContacts();
    let contatos = [];
    lista.map((contato) => {
      let word = contato.lastMessage;
      while (word.search("\n") != -1) {
        word = word.replace("\n", "  ");
      }
      contatos = contatos.concat({
        id: contato.contactId,
        nome: contato.contactName,
        lastMessage: word,
        email: contato.contactEmail,
        createdAt: contato.createdAt,
      });
    });
    setContatos(sortByDate(contatos));
    setIsLoading(false);
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
        <Title>Conversas</Title>
      </Header>
      <FlatList
        data={contatos}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => (
          <ContactList onPress={handleChat} {...item} />
        )}
        ListEmptyComponent={() => <EmptyContactList />}
      />
      <LoadingModal visible={isLoading} />
    </Background>
  );
};
export default Message;
