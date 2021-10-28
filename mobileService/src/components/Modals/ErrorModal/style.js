import { StyleSheet } from "react-native";
import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 0px 30px;
  justify-content: center;
`;

export const Card = styled.View`
  background-color: #f8f8ff;
  border-radius: 5px;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  padding: 0 20px;
`;

export const Button = styled.TouchableOpacity`
  padding: 10px 30px;
  background-color: #ff0000;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 3px;
`;

export const IconWrapper = styled.View`
  background-color: #ff0000;
  width: 100px;
  height: 100px;
  border-radius: 50px;
  position: absolute;
  top: -50px;
  justify-content: center;
  align-items: center;
`;

export const ErrorText = styled.Text`
  color: #000;
  text-align: center;
  font-family: "Montserrat-Regular";
  margin-top: 60px;
`;

export const ButtonText = styled.Text`
  color: #f8f8ff;
  font-family: "Montserrat-Regular";
`;
