import React from "react";

import Icon from "react-native-vector-icons/FontAwesome";

import {
  CategoryButton,
  CategoryButtonArea,
  CategoryText,
  CategoryTextArea,
  Container,
} from "./style";

const CategoryList = ({ primeiro, segundo, onPress, disable = false }) => {
  const renderizar = (dados = { icone: undefined, categoria: "ERRO" }) => {
    if (dados.icone != undefined) {
      return (
        <CategoryButtonArea>
          <CategoryButton disabled={disable} onPress={() => onPress(dados)}>
            <Icon
              style={{ color: "#fff", alignSelf: "center" }}
              size={40}
              name={dados.icone}
            />
            <CategoryTextArea>
              <CategoryText>{dados.categoria}</CategoryText>
            </CategoryTextArea>
          </CategoryButton>
        </CategoryButtonArea>
      );
    } else return <></>;
  };

  return (
    <Container>
      {renderizar(primeiro)}
      {renderizar(segundo)}
    </Container>
  );
};

export default CategoryList;
