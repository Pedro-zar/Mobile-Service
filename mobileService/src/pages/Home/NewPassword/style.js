import styled from "styled-components/native";

export const Title = styled.Text`
  color: #f8f7ff;
  font-size: 30px;
  font-family: "Montserrat-Bold";
  text-align: justify;
  align-self: center;
`;

export const Subtitle = styled.Text`
  align-self: center;
  padding-top: 10px;
  color: #f8f7ff;
  font-size: 19px;
  font-family: "Montserrat-Bold";
  text-align: justify;
  margin-bottom: 0;
`;

export const LogoImage = styled.Image`
  height: 90px;
  width: 270px;
  margin-top: 50px;
`;

export const Button = styled.TouchableOpacity`
  font-size: 15px;
  color: #fff;
  padding: 0px;
`;
export const IconText = styled.Text`
  color: #fff;
  font-family: "Montserrat-Bold";
  opacity: 1;
`;

export const Container = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
`;

export const BodyWrapper = styled.View`
  margin-top: 40px;
  background-color: #27458b;
  border-radius: 19px;
  width: 80%;
  height: 300px;
`;

export const BottomWrapper = styled.View`
  left: 10px;
  align-self: flex-end;
  margin-right: 30px;
`;
