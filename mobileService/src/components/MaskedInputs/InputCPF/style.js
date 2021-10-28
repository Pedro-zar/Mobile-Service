import { StyleSheet } from "react-native";
import styled from "styled-components/native";

export const Container = styled.View`
  width: 48%;
  padding-right: 0;
  opacity: ${(props) => (props.editable ? 1 : 0.5)};
  padding-left: 10px;
  padding-top: 20px;
`;

export const SubTitle = styled.Text`
  color: #fff;
  font-size: 15px;
  font-family: "Montserrat-Bold";
`;

export const ErrorText = styled.Text`
  color: #f00;
  font-family: "Montserrat-Regular";
  font-size: 12px;
`;

const styles = StyleSheet.create({
  Input: (erro) => ({
    borderBottomWidth: 1,
    borderColor: erro ? "#f00" : "#fff",
    padding: 0,
    color: "#fff",
    fontFamily: "Montserrat-Regular",
    fontSize: 15,
  }),
});

export default styles;
