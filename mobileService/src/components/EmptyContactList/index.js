import React from "react";

import { Container, ContainerText } from "./style";

const EmptyContactList = () => {
  return (
    <Container>
      <ContainerText>Não encontramos nenhum contato</ContainerText>
      <ContainerText>Vá para a Agenda e agende um atendimento!</ContainerText>
    </Container>
  );
};

export default EmptyContactList;
