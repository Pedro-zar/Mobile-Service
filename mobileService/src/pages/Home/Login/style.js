import styled from "styled-components/native";

export const Header = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.Text`
  font-size: 29px;
  text-align: justify;
  padding-top: 20px;
  color: #f8f7ff;
  font-family: "Montserrat-Bold";
`;
export const LogoImage = styled.Image`
  height: 90px;
  width: 270px;
  margin-top: 65px;
`;

export const Body = styled.View`
  margin-bottom: 60px;
  margin-top: 22px;
  flex: 1;
`;
export const ForgotPasswordButton = styled.TouchableOpacity`
  align-self: center;
  margin-top: 10px;
  flex-direction: row;
  align-items: center;
`;
export const ForgotPasswordText = styled.Text`
  font-size: 15px;
  color: #fff;
  text-decoration-line: underline;
  font-family: "Montserrat-Regular";
`;

export const Button = styled.TouchableOpacity`
  background-color: #fff;
  align-items: center;
  padding: 10px 0px;
  border-radius: 65px;
  margin: 10px 70px;
`;

export const TextButton = styled.Text`
  font-family: "Montserrat-SemiBold";
  font-size: 20px;
  color: #27458b;
`;
