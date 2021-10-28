import styled from "styled-components/native";

export const Container = styled.View`
  height: 50px;
  flex-direction: row;
  border-bottom-color: ${(props) => (props.erro ? "#f00" : "#fff")};
  border-bottom-width: 1px;
  margin: 0 40px 10px 40px;
`;

export const Input = styled.TextInput`
  flex: 1;
  color: #fff;
  padding-bottom: 0px;
`