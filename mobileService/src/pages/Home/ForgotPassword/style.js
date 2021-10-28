import styled from "styled-components/native";

export const Title = styled.Text`
  color: #f8f7ff;
  font-size: 20px;
  text-align: justify;
  align-self: center;
  font-family: "Montserrat-Bold";
`;

export const Subtitle = styled.Text`
  align-self: center;
  color: #f8f7ff;
  font-size: 17px;
  font-family: "Montserrat-Bold";
  text-align: justify;
  margin-bottom: 0px;
`;

export const ChangeNumber = styled.TouchableOpacity`
  align-self: flex-start;
  margin-bottom: 50px;
  flex-direction: row;
  align-items: center;
  margin-left: 47px;
`;

export const LogoImage = styled.Image`
  height: 90px;
  width: 270px;
  margin-top: 40px;
`;

export const Button = styled.TouchableOpacity`
  left: 30px;
  top: 35px;
  font-size: 15px;
  color: #fff;
  padding: 0px;
`;

export const ConfirmButton = styled.TouchableOpacity`
  padding: 5px 10px;
  align-self: center;
  background-color: #fff;
  margin-left: 10px;
  border-radius: 65px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  align-items: center;
`;

export const ChangeNumberText = styled.Text`
  opacity: ${(props) => (props.enabled ? 1 : 0.6)};
  font-size: 15px;
  color: #fff;
  text-decoration-line: underline;
  font-family: "Montserrat-Regular";
`;

export const IconText = styled.Text`
  color: #fff;
  font-family: "Montserrat-Bold";
  opacity: ${(props) => (props.enabled ? 1 : 0.6)};
`;

export const Body = styled.View`
  margin-top: 40px;
  background-color: #27458b;
  border-radius: 19px;
`;

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Header = styled.View`
  margin-top: 0px;
`;

export const SmsText = styled.Text`
  align-self: center;
  color: #f2f2ff;
  font-size: 15px;
  font-family: "Montserrat-Regular";
`;

export const CodeContainer = styled.View`
  align-self: center;
  width: 250px;
  flex-direction: row;
  justify-content: space-around;
`;

export const ContainerInput = styled.View`
  flex-direction: row;
`;

export const ConfirmButtonText = styled.Text`
  align-self: center;
  font-family: "Montserrat-SemiBold";
`;

export const Column = styled.View`
  flex-direction: column;
`;
