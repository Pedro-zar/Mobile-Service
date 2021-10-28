import styled from "styled-components/native";

export const Title = styled.Text`
  font-size: 20px;
  text-align: justify;
  padding-top: 0;
  color: #f8f7ff;
  font-family: "Montserrat-SemiBold";
  right: 10px;
`;

export const Header = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background-color: #213A74;
  padding-bottom: 15px;
`;

export const Button = styled.TouchableOpacity`
  background-color: #fff;
  align-items: center;
  padding: 10px 30px;
  border-radius: 65px;
  margin: 10px 70px;
`;

export const TextButton = styled.Text`
  font-family: "Montserrat-SemiBold";
  font-size: 20px;
  color: #27458b;
`;

export const LoadingCepContainer = styled.View`
  padding: 70px 0px;
  align-items: center;
`;

export const LoadingCepText = styled.Text`
  color: #fff;
  font-family: "Montserrat-Regular";
`;

export const Row = styled.View`
  flex-direction: row;
`;

export const Bottom = styled.View`
  margin-top: 10px;
`;

export const FormContainer = styled.View`
  justify-content: space-around;
`;

export const LoadingDataText = styled.Text`
  color: #fffafa;
  font-family: "Montserrat-Bold";
  font-size: 16px;
  justify-content: center;
`;

export const LoadingDataContainer = styled.View`
  padding: 60% 0px;
  align-items: center;
`;
