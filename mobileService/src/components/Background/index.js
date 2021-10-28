import React from "react";

import { View } from "react-native";

export default Background = ({ children, color = "#27458b"}) => {
  return (
    <>
      <View style={{ flex: 1, backgroundColor: color }}>{children}</View>
    </>
  );
};
