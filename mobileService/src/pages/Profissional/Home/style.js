import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  height: 120px;
  position: absolute;
`;

export const HeaderItem = styled.View`
  flex-direction: row;
  margin-top: 10px;
  justify-content: space-evenly;
  width: 100%;
  /* transform: scale(0.9); */
`;

export const LogoutButtonView = styled.TouchableOpacity`
  position: absolute;
  right: 15px;
  top: 10px;
`;

export const CardView = styled.View`
  background-color: #fffaff;
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 120px;
`;

export const WelcomeView = styled.View`
  background-color: #213a74;
  height: 30px;
  justify-content: center;
`;

export const HeaderItemText = styled.Text`
  font-family: "Montserrat-Regular";
  font-size: 15px;
  color: #fffafa;
  text-align: center;
`;

export const Title = styled.Text`
  align-self: center;
  font-size: 20px;
  color: #fffafa;
  font-family: "Montserrat-SemiBold";
`;

export const Subtitle = styled.Text`
  text-align: center;
  font-size: 15px;
  color: #fffafa;
  font-family: "Montserrat-Medium";
`;

export const LogoutButtonText = styled.Text`
  color: #fff;
`;
