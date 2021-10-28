import React, { useEffect, useState } from "react";

import { Modal, StyleSheet, Pressable } from "react-native";

import SelectCategoryAgenda from "~components/SelectCategoryAgenda";

import AddAgendaDadosScreen from "~components/AddAgendaDadosScreen";

import { Container, Card } from "./style";

const RegisterAgenda = ({ visible = true, onClose, dados, refresh }) => {
  const i = onClose;
  onClose = () => {
    i();
    setEstado("categoria");
  };
  const dadosOriginais = dados;
  const [data, setData] = useState([]);
  const [estado, setEstado] = useState("categoria");
  const [categoria, setCategoria] = useState();
  //init da variavel de Data (a lista de coisas)
  useEffect(() => {
    onTextChange();
  }, []);

  //função chamada quando o texto muda para filtrar a lista
  const onTextChange = (texto = "") => {
    //filtrar Dados conforme o Texto
    texto = texto.replace(" ", "").toLocaleLowerCase();
    let tempDados;
    if (texto == "") tempDados = dadosOriginais;
    else {
      tempDados = [];
      dadosOriginais.map((value) => {
        if (
          value.categoria.replace(" ", "").toLocaleLowerCase().includes(texto)
        )
          tempDados = tempDados.concat(value);
      });
    }
    assignData(tempDados);
  };

  //função de tratamento pós Filter para enviar para o CategoryList
  const assignData = (tempDados) => {
    dados = [];
    for (let i = 0; i < tempDados.length / 2; i++)
      dados = dados.concat({ primeiro: {}, segundo: {} });
    let first = true;
    let position = 0;
    for (let i = 0; i < tempDados.length; i++) {
      if (first) dados[position].primeiro = tempDados[i];
      else {
        dados[position].segundo = tempDados[i];
        position++;
      }
      first = !first;
    }
    setData(dados);
  };

  const nextState = (categoria) => {
    setCategoria(categoria);
    setEstado("serviço");
  };

  const component = (estado) => {
    switch (estado) {
      case "categoria":
        return (
          <SelectCategoryAgenda
            dados={data}
            nextState={nextState}
            onTextChange={onTextChange}
          />
        );
      case "serviço":
        return (
          <AddAgendaDadosScreen
            refresh={refresh}
            onClose={onClose}
            dados={categoria}
          />
        );
      default:
        return;
    }
  };

  return (
    <Modal
      animationType={"slide"}
      visible={visible}
      transparent={true}
      onRequestClose={onClose}
    >
      <Container>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Card>{component(estado)}</Card>
      </Container>
    </Modal>
  );
};

export default RegisterAgenda;
