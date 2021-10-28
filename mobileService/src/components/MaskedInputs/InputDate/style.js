import { StyleSheet } from "react-native";
import styled from "styled-components/native";

export const Container = styled.View`
  width: ${(props) => (props.day ? 46 : 26)}%;
  margin-bottom: 20px;
  margin-right: 0px;
  padding-left: 15px;
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
    borderColor: erro ? "#f00" : "#000",
    padding: 0,
    fontFamily: "Montserrat-Regular",
    fontSize: 15,
    opacity: 1,
  }),
});

export default styles;
