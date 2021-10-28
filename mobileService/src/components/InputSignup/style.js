import styled from "styled-components/native";

export const Container = styled.View`
  width: ${(props) => props.width}%;
  opacity: ${(props) => (props.editable ? 1 : 0.5)};
  padding: 20px 10px 0px 10px;
`;

export const SubTitle = styled.Text`
  color: #fff;
  font-size: 15px;
  font-family: "Montserrat-Bold";
`;

export const Input = styled.TextInput`
  border-bottom-width: 1px;
  border-color: ${(props) => (props.erro ? "#f00" : "#fff")};
  padding: 0px;
  color: #fff;
  font-family: "Montserrat-Regular";
  font-size: 15px;
`;

export const ErrorText = styled.Text`
  color: #f00;
  font-family: "Montserrat-Regular";
  font-size: 12px;
`;
