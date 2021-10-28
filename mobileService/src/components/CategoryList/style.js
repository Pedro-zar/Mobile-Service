import styled from "styled-components/native";

export const CategoryButtonArea = styled.View`
  width: 100px;
  height: 100px;
`;

export const CategoryButton = styled.TouchableOpacity`
  background-color: #213a74;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  flex: 1;
`;

export const CategoryTextArea = styled.View`
  flex-direction: row;
  justify-content: center;
`;

export const CategoryText = styled.Text`
  align-self: center;
  font-size: 11px;
  color: #fff;
`;

export const Container = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;
