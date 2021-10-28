import React, { forwardRef } from "react";

import { Container, ErrorText, Input, SubTitle } from "./style";

const InputSignup = (
  {
    editable = true,
    error = false,
    keyboardType = "default",
    onBlur = () => {},
    onChangeText = () => {},
    password = false,
    next,
    placeholder = "",
    title = "",
    value,
    width = 100,
    last = false,
    blurSubmit = false,
  },
  ref
) => {
  return (
    <Container editable={editable} width={width}>
      <SubTitle>{title}</SubTitle>
      <Input
        autoCapitalize={password ? "none" : "sentences"}
        editable={editable}
        keyboardType={keyboardType}
        onBlur={() => onBlur()}
        onChangeText={onChangeText}
        onSubmitEditing={(() => OnBlur(), next)}
        placeholder={placeholder}
        blurOnSubmit={blurSubmit}
        returnKeyType={last ? "done" : "go"}
        placeholderTextColor="rgba(255,255,255, 0.6)"
        ref={ref}
        secureTextEntry={password}
        selectionColor="#fff"
        erro={error}
        value={value}
      />
      {!!error && <ErrorText>Dados inválidos</ErrorText>}
    </Container>
  );
};

export default forwardRef(InputSignup);
