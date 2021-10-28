import React from "react";

import { TextInputMask } from "react-native-masked-text";

import styles, { Container, ErrorText, SubTitle } from "./style";

const InputCPF = ({
  onChangeText = () => {},
  error = false,
  onBlur = () => {},
  value,
  cpfRef = () => {},
  editable = true,
  next,
}) => {
  return (
    <Container editable={editable}>
      <SubTitle>CPF</SubTitle>
      <TextInputMask
        editable={editable}
        includeRawValueInChangeText={true}
        onBlur={() => onBlur()}
        blurOnSubmit={false}
        onSubmitEditing={(() => onBlur(), next)}
        returnKeyType="go"
        onChangeText={(maskedText, rawText) => onChangeText(rawText)}
        placeholder="999.999.999-99"
        placeholderTextColor="rgba(255,255,255, 0.6)"
        ref={(ref) => cpfRef(ref)}
        style={styles.Input(error)}
        selectionColor="#fff"
        type={"cpf"}
        value={value}
      />
      {!!error && <ErrorText>CPF inválido</ErrorText>}
    </Container>
  );
};

export default InputCPF;
