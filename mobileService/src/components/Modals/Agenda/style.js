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
  padding: 20px 00px;
  background-color: #f8f8ff;
`;

export const Button = styled.TouchableOpacity`
  padding: 5px 10px;
  background-color: ${(props) => props.color};
  margin: 10px 0px;
  border-radius: 3px;
  align-self: auto;
  justify-content: center;
`;
export const MessageText = styled.Text`
  color: #000000;
  text-align: center;
  font-family: "Montserrat-Regular";
  padding: 0px 0px;
  text-align: center;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-family: "Montserrat-SemiBold";
  text-align: center;
`;
