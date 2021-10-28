import styled from "styled-components/native";

export const Button = styled.TouchableOpacity`
  margin: 10px 40px 0px 40px;
  padding: 10px 0px;
  background-color: ${(props) => props.color};
  border-radius: 5px;
  elevation: 7;
`;

export const ButtonText = styled.Text`
  text-align: center;
  color: #fff;
  padding-right: 15px;
`;

export const ButtonArea = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: center;
`;
