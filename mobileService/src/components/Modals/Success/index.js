import React from "react";

import { Modal, Pressable, StyleSheet } from "react-native";

import Icon from "react-native-vector-icons/AntDesign";

import { Button, ButtonText, Card, Container, MessageText } from "./style";

const Success = ({
  visible = false,
  message = "teste",
  onClose = () => {},
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType={"slide"}
      onRequestClose={onClose}
    >
      <Container>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Card>
          <Icon
            name="checkcircleo"
            color="#00ff00"
            size={60}
            style={{ paddingTop: 10 }}
          />
          <MessageText>{message}</MessageText>
        </Card>

        <Button onPress={onClose}>
          <ButtonText>OK</ButtonText>
        </Button>
      </Container>
    </Modal>
  );
};

export default Success;
