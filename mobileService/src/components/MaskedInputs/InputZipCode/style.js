import { StyleSheet } from "react-native";
import styled from "styled-components/native";

export const Container = styled.View`
  width: ${(props) => props.width};
  margin-left: 0;
  padding: 20px 10px 0px 10px;
`;

export const SubTitle = styled.Text`
  color: #fff;
  font-size: 15px;
  font-family: "Montserrat-Bold";
  margin-bottom: 0;
`;

export const ErrorText = styled.Text`
  color: #f00;
  font-family: "Montserrat-Regular";
  font-size: 12px;
`;

const styles = StyleSheet.create({
  Input: (error) => ({
    borderBottomWidth: 1,
    borderColor: error ? "#f00" : "#fff",
    padding: 0,
    color: "#fff",
    fontFamily: "Montserrat-Regular",
    fontSize: 15,
  }),
});

export default styles;
