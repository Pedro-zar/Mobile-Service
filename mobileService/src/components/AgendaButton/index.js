import React from "react";

import { Button, ButtonText } from "./style";

const AgendaButton = ({
  setVisible,
  setDados,
  agendaData: {
    cliente = "---",
    profissional,
    profissao,
    id,
    type,
    data,
    obs = "---",
    hora,
    profEmail,
  },
}) => {
  const setModalsMessage = (dados) => {
    setDados(dados);
    setVisible(true);
  };

  const getColor = () => {
    switch (type) {
      case "agendada":
        return "#383F52";
      case "postada":
        return "#3F4040";
      case "cancelada":
        return "#810E0E";
      case "atendida":
        return "#024B04";
      case "aguardando confirmação de atendimento":
        return "#2B1544";
      default:
        return "#000";
    }
  };

  const getFirstWord = (phrase) => {
    const indexFirtSpace = String(phrase).indexOf(" ");

    const firstWord = String(phrase).substr(0, indexFirtSpace);
    if (firstWord == "") return phrase;
    else return firstWord;
  };

  const capitalizeFirstLetter = (phrase) => {
    return phrase.charAt(0).toUpperCase() + phrase.slice(1);
  };

  return (
    <Button
      onPress={() =>
        setModalsMessage({
          cliente: cliente,
          profissional: profissional,
          profissao: profissao,
          id: id,
          type: type,
          data: data,
          obs: obs,
          hora: hora,
          profEmail: profEmail,
        })
      }
      color={getColor()}
    >
      <ButtonText>
        {profissao +
          " - " +
          data +
          (cliente == "---"
            ? ""
            : " - " + capitalizeFirstLetter(getFirstWord(cliente)))}
      </ButtonText>
    </Button>
  );
};

export default AgendaButton;
