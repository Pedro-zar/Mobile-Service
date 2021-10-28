import styled from "styled-components/native";

export const Button = styled.TouchableOpacity`
  background-color: #fff;
  align-items: center;
  padding: 10px 30px;
  border-radius: 65px;
  margin: 10px 70px;
`;

export const Row = styled.View`
  flex-direction: row;
`;

export const TextButton = styled.Text`
  font-family: "Montserrat-SemiBold";
  font-size: 20px;
  color: #27458b;
`;

export const Header = styled.View`
  justify-content: center;
  align-items: center;
`;
export const Body = styled.View`
  justify-content: space-around;
`;
export const Bottom = styled.View`
  margin-top: 10px;
`;

export const Title = styled.Text`
  font-size: 23px;
  text-align: justify;
  padding-top: 40px;
  color: #f7f7ff;
  font-family: "Montserrat-Bold";
`;

export const LoadingCep = styled.View`
  padding: 70px 0px;
  align-items: center;
`;

export const LoadingCepText = styled.Text`
  color: #fff;
  font-family: "Montserrat-Regular";
`;
