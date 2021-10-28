import React from "react";

import { FlatList } from "react-native";

import CategoryList from "~components/CategoryList";

import { SearchCategoryText } from "./style";

const SelectCategoryAgenda = ({ dados, nextState, onTextChange }) => {
  return (
    <FlatList
      contentContainerStyle={{
        justifyContent: "center",
      }}
      data={dados}
      ListHeaderComponent={
        <SearchCategoryText
          returnKeyType="search"
          placeholder="Procure uma categoria"
          onChangeText={onTextChange}
        />
      }
      keyExtractor={({ primeiro }) => primeiro.id}
      renderItem={({ item }) => <CategoryList onPress={nextState} {...item} />}
    />
  );
};

export default SelectCategoryAgenda;
