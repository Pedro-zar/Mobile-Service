import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 0 30px;
  justify-content: center;
`;

export const Card = styled.View`
  border-radius: 5px;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  padding: 0 20px;
  background-color: #f8f8ff;
`;

export const Button = styled.TouchableOpacity`
  padding: 10px 30px;
  background-color: #70e000;
  margin: 10px 0px;
  border-radius: 3px;
`;

export const MessageText = styled.Text`
  color: #000000;
  text-align: center;
  font-family: "Montserrat-Regular";
  margin: 20px 0px;
`;

export const ButtonText = styled.Text`
  color: #f8f8ff;
  font-family: "Montserrat-Regular";
`;
