import styled from "styled-components/native";

export const Container = styled.View`
  padding: 0px 15px;
`;

export const CenteredText = styled.Text`
  text-align: center;
`;

export const HeaderArea = styled.View`
  margin-top: 15px;
`;

export const Header = styled.View`
  padding-top: 15px;
  flex-direction: row;
  background-color: #fff;
`;

export const ProfInputArea = styled.View`
  padding-left: 10px;
  padding-top: 10px;
`;

export const ObsTextInput = styled.TextInput`
  width: 240px;
  border-width: 1px;
  border-radius: 20px;
  margin-top: 10px;
  padding: 0px 10px;
`;

export const ProfText = styled.Text`
  width: 130px;
  text-align: center;
`;

export const ProfTextInput = styled.TextInput`
  width: 130px;
  border-bottom-width: 1px;
  margin-top: 5px;
  border-color: ${(props) => (props.error ? "#f00" : "#000")};
  padding: 0px 10px;
`;

export const Footer = styled.View`
  align-items: center;
`;

export const ConfirmButton = styled.TouchableOpacity`
  background-color: #004d03;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 30px;
  margin-bottom: 10px;
`;

export const ConfirmTextButton = styled.Text`
  color: #fff;
`;

export const InputDateArea = styled.View`
  flex-direction: row;
  align-self: center;
  padding-right: 15px;
`;
