import React from "react";

import { TextInputMask } from "react-native-masked-text";

import styles,{Container, ErrorText, SubTitle} from "./style";

const InputPhone = ({
  onChangeText = () => {},
  error = false,
  onBlur = () => {},
  value,
  phoneRef = () => {},
  next,
  blurSubmit = false,
  last = false,
  autoFocus = false,
  editable = true,
  alt = false,
}) => {
  return (
    <Container alt={alt}>
      <SubTitle>Telefone</SubTitle>
      {
        <TextInputMask
          ref={(ref) => phoneRef(ref)}
          style={styles.Input(error, editable)}
          includeRawValueInChangeText={true}
          editable={editable}
          onBlur={() => onBlur()}
          blurOnSubmit={false}
          autoFocus={autoFocus}
          selectionColor="#fff"
          returnKeyType={last ? "done" : "go"}
          blurOnSubmit={blurSubmit}
          onSubmitEditing={(() => onBlur(), next)}
          placeholder="(11)99999-9999"
          placeholderTextColor="rgba(255,255,255, 0.5)"
          type={"cel-phone"}
          options={{
            maskType: "BRL",
            withDDD: true,
            dddMask: "(99) ",
          }}
          value={value}
          onChangeText={(maskedText, rawText) => onChangeText(rawText)}
        />
      }
      {!!error && (
        <ErrorText>
          Dados inválidos
        </ErrorText>
      )}
    </Container>
  );
};

export default InputPhone;
