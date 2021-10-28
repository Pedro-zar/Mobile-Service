import React from "react";

import Icon from "react-native-vector-icons/Feather";

import { Button, Container, Subtitle } from "./style";

const GoBackButton = ({
  navigation,
  onPress = () => navigation.goBack(),
  showText = true,
  color = "#fff",
}) => {
  return (
    <Container>
      <Button onPress={onPress}>
        <Icon name={"chevron-left"} size={40} color={color} />
        {showText && <Subtitle>Voltar</Subtitle>}
      </Button>
    </Container>
  );
};

export default GoBackButton;
