import { StyleSheet } from "react-native";
import styled from 'styled-components/native';

export const Container = styled.View`
  margin-bottom: 20px;
  width: 20%;
  padding: 35px 10px;
`;


const styles = StyleSheet.create({
  Input: (editable) => ({
    borderBottomWidth: 1,
    borderColor: "#fff",
    padding: 0,
    color: "#fff",
    opacity: editable? 1: 0.5,
    fontFamily: "Montserrat-Regular",
    fontSize: 35,
    textAlign: 'center',
  }),
});

export default styles;
