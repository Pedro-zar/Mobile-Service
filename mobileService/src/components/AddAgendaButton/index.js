import React from "react";

import Icon from "react-native-vector-icons/Ionicons";

import { Button, ButtonText, ButtonArea } from "./style";

const AddAgendaButton = ({ setVisible, color }) => {
  return (
    <Button onPress={() => setVisible(true)} color={color}>
      <ButtonArea>
        <Icon
          style={{ color: "#fff", paddingRight: 15 }}
          size={20}
          name="add-circle-outline"
        />
        <ButtonText>{"Adicione um horário de\natendimento"}</ButtonText>
      </ButtonArea>
    </Button>
  );
};

export default AddAgendaButton;
