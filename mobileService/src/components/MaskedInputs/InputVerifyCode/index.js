import React, { forwardRef } from "react";

import { TextInputMask } from "react-native-masked-text";

import styles, { Container } from "./style";

const InputVerifyCode = (
  { onChangeText = () => {}, value, next, last = false, editable = false },
  ref
) => {
  return (
    <Container>
      <TextInputMask
        ref={ref}
        onChangeText={onChangeText}
        onSubmitEditing={next}
        placeholder={"0"}
        placeholderTextColor="rgba(255,255,255, 0.6)"
        returnKeyType={last ? "done" : "go"}
        selectionColor
        style={styles.Input(editable)}
        value={value}
        editable={editable}
        blurOnSubmit={false}
        type={"custom"}
        keyboardType={'default'}
        options={{
          mask: "S",
        }}
      />
    </Container>
  );
};

export default forwardRef(InputVerifyCode);
