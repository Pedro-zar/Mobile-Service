import React from "react";

import { Modal } from "react-native";

import Icon from "react-native-vector-icons/AntDesign";

import {
  Card,
  Container,
  Button,
  IconWrapper,
  ErrorText,
  ButtonText,
} from "./style";

export default ErrorModal = ({
  visible = false,
  message = "",
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
        <Card>
          <IconWrapper>
            <Icon name="closecircleo" color="#f8f8ff" size={60}></Icon>
          </IconWrapper>
          <ErrorText>{message}</ErrorText>
          <Button onPress={() => onClose(false)}>
            <ButtonText>OK</ButtonText>
          </Button>
        </Card>
      </Container>
    </Modal>
  );
};
