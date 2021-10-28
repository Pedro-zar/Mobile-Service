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
`;