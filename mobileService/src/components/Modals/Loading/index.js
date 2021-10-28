import React from "react";

import { Modal, ActivityIndicator } from "react-native";

import { ButtonText, Card, Container } from "./style";

export default Loading = ({ visible = false }) => {
  return (
    <Modal transparent={true} visible={visible} animationType={"slide"}>
      <Container>
        <Card>
          <ActivityIndicator color="#27458b" size="large" />
          <ButtonText>Carregando...</ButtonText>
        </Card>
      </Container>
    </Modal>
  );
};
