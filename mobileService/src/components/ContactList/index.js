import React from "react";

import { ContactButton, ContactName, LastMessage, HourText } from "./style";

import { GiftedAvatar } from "react-native-gifted-chat";

import { View } from "react-native";

export default ListContact = ({
  nome,
  id,
  lastMessage,
  email,
  onPress,
  createdAt,
}) => {
  let hours = createdAt.getHours() + ":";
  let minutes = createdAt.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;

  return (
    <ContactButton
      onPress={() => onPress({ nome: nome, id: id, email: email })}
    >
      <GiftedAvatar avatarStyle={{ margin: 5 }} user={{ name: nome }} />
      <View style={{ flex: 1 }}>
        <ContactName>{nome}</ContactName>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <LastMessage>{lastMessage}</LastMessage>
          <HourText>{hours + minutes}</HourText>
        </View>
      </View>
    </ContactButton>
  );
};
