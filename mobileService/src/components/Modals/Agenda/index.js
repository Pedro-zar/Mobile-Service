import React from "react";

import { Modal, Pressable, StyleSheet, View } from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";

import { useSelector } from "react-redux";

import { user } from "~store/selectors";

import { Button, ButtonText, Card, Container, MessageText } from "./style";

export default AgendaModal = ({
  visible,
  onPressConfirmed = () => {},
  onPressConfirm = () => {},
  onPressCancel = () => {},
  onPressAgend = () => {},
  dados: {
    cliente,
    profissao,
    profissional,
    profEmail,
    data,
    id,
    type,
    obs,
    hora,
  },
}) => {
  const userData = useSelector(user);
  const getButton = () => {
    if (type == "postada") {
      if (userData.tipo == "prof")
        return (
          <Button
            style={{ marginLeft: 20 }}
            color="#8A0000"
            onPress={() =>
              onPressCancel({
                message: `${data} - ${profissao}`,
                id: id,
                cancelar: false,
              })
            }
          >
            <ButtonText>Remover</ButtonText>
            <Icon
              style={{ color: "#fff", alignSelf: "center" }}
              size={20}
              name="trash"
            />
          </Button>
        );
      else
        return (
          <Button
            style={{ marginLeft: 20 }}
            color="#2B1544"
            onPress={() =>
              onPressAgend(
                `Deseja marcar este horário?`,
                id,
                userData.id,
                userData.nome,
                profEmail,
                profissional
              )
            }
          >
            <ButtonText>Agendar</ButtonText>
            <Icon
              style={{ color: "#fff", alignSelf: "center" }}
              size={20}
              name="edit"
            />
          </Button>
        );
    }
    if (type == "agendada") {
      return (
        <>
          <Button
            style={{ marginLeft: 20 }}
            color="#8A0000"
            onPress={() =>
              onPressCancel({
                message: `${data} - ${profissao}`,
                id: id,
                cancelar: true,
              })
            }
          >
            <ButtonText>Cancelar</ButtonText>
            <Icon
              style={{ color: "#fff", alignSelf: "center" }}
              size={20}
              name="trash"
            />
          </Button>
          {"prof" == userData.tipo ? (
            <Button
              style={{ marginLeft: 20 }}
              color="#2B1544"
              onPress={() => onPressConfirmed(id)}
            >
              <ButtonText>Confirmar</ButtonText>
              <Icon
                style={{ color: "#fff", alignSelf: "center" }}
                size={20}
                name="check-square-o"
              />
            </Button>
          ) : (
            <></>
          )}
        </>
      );
    }
    if (type == "aguardando confirmação de atendimento") {
      if (userData.tipo == "clie")
        return (
          <Button
            style={{ marginLeft: 20 }}
            color="#2B1544"
            onPress={() => onPressConfirmed(id)}
          >
            <ButtonText>Confirmar</ButtonText>
            <Icon
              style={{ color: "#fff", alignSelf: "center" }}
              size={20}
              name="check-square-o"
            />
          </Button>
        );
    }
  };

  return (
    <Modal
      animationType={"slide"}
      visible={visible}
      transparent={true}
      onPress={onPressConfirm}
    >
      <Container>
        <Pressable style={StyleSheet.absoluteFill} onPress={onPressConfirm} />
        <Card>
          <MessageText>Cliente: {cliente}</MessageText>
          <MessageText>Profissional: {profissional}</MessageText>
          <MessageText>Detalhes: {profissao}</MessageText>
          <MessageText>
            Data: {data} - {hora}
          </MessageText>
          <MessageText>Status: {type}</MessageText>
          <MessageText>ID: {id}</MessageText>
          <MessageText>Observação: {obs}</MessageText>
        </Card>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Button color="#064C08" onPress={onPressConfirm}>
            <ButtonText>Ok</ButtonText>
            <Icon
              style={{
                color: "#fff",
                alignSelf: "center",
                marginHorizontal: 25,
              }}
              size={20}
              name="check"
            />
          </Button>
          {getButton()}
        </View>
      </Container>
    </Modal>
  );
};
