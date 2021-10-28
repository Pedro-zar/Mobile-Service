import React from "react";

import { TextInputMask } from "react-native-masked-text";

import styles, { Container, ErrorText, SubTitle } from "./style";

const InputZipCode = ({
  error = false,
  value,
  cepRef = () => {},
  onChangeText = () => {},
  onBlur = () => {},
  next,
  width = "50%",
}) => {
  return (
    <Container width={width}>
      <SubTitle>CEP</SubTitle>
      <TextInputMask
        ref={(ref) => cepRef(ref)}
        includeRawValueInChangeText={true}
        onBlur={() => onBlur()}
        onChangeText={(maskedText, rawText) => onChangeText(rawText)}
        placeholder="12345-678"
        returnKeyType="done"
        blurOnSubmit={false}
        placeholderTextColor="rgba(255,255,255, 0.5)"
        onSubmitEditing={(() => onBlur(), next)}
        selectionColor="#fff"
        style={styles.Input(error)}
        type={"zip-code"}
        value={value}
      />
      {!!error && <ErrorText>CEP inválido</ErrorText>}
    </Container>
  );
};

export default InputZipCode;
