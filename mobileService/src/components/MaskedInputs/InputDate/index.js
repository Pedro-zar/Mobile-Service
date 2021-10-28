import React, { forwardRef } from "react";

import { TextInputMask } from "react-native-masked-text";

import styles, { Container } from "./style";

const InputDate = (
  { value, day, erro, onSubmitEditing, onChangeText },
  ref
) => {
  return (
    <Container day={day}>
      <TextInputMask
        ref={ref}
        erro={erro}
        options={day ? { format: "DD/MM/YYYY" } : { format: "HH:mm" }}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={day ? "go" : "done"}
        blurOnSubmit={!day}
        style={styles.Input(erro)}
        value={value}
        placeholder={day ? "__/__/____" : "__:__"}
        type={"datetime"}
      />
    </Container>
  );
};

export default forwardRef(InputDate);
