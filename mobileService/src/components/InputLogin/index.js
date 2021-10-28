import React, { forwardRef } from "react";

import Icon from "react-native-vector-icons/FontAwesome5";

import { Container, Input } from "./style";

const InputLogin = (
  {
    icon,
    placeholder,
    password = false,
    onChangeText,
    error = false,
    next = () => {},
    blurSubmit = false,
  },
  ref
) => (
  <Container erro={error}>
    <Icon
      name={icon}
      size={30}
      color={"#fff"}
      style={{ alignSelf: "center", padding: 5 }}
    />
    <Input
      autoCapitalize={"none"}
      autoCompleteType={password ? "password" : "email"}
      onChangeText={onChangeText}
      onSubmitEditing={next}
      blurOnSubmit={blurSubmit}
      placeholder={placeholder}
      placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
      ref={ref}
      returnKeyType={password ? "done" : "go"}
      secureTextEntry={password}
      textContentType={password ? "password" : "emailAddress"}
    />
  </Container>
);

export default forwardRef(InputLogin);
