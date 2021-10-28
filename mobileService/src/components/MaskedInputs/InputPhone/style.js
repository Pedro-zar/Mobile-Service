import { StyleSheet } from "react-native";
import styled from "styled-components/native";

export const Container = styled.View`
  width: 48%;
  margin-bottom: 20px;
  margin-right: ${(props) => (props.alt ? 10 : 0)}px;
  padding-left: ${(props) => (props.alt ? 10 : 15)}px;
  padding-right: 0px;
  padding-top: 20px;
  padding-bottom: 0px;
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
  Input: (erro, editable) => ({
    borderBottomWidth: 1,
    borderColor: erro ? "#f00" : "#fff",
    padding: 0,
    color: "#fff",
    fontFamily: "Montserrat-Regular",
    fontSize: 15,
    opacity: editable ? 1 : 0.5,
  }),
});

export default styles;
