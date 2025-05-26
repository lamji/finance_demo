import React, { useRef } from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { IconSymbol } from "./ui/IconSymbol";

interface SwipeableRowProps {
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  id?: string;
  onDelete?: () => void;
}

export const SwipeableRow: React.FC<SwipeableRowProps> = ({
  children,
  containerStyle,
  id = "unknown",
  onDelete,
}) => {
  const swipeableRef = useRef<Swipeable>(null);

  const renderRightActions = () => {
    return (
      <TouchableOpacity
        style={[styles.deleteAction]}
        onPress={() => {
          if (onDelete) {
            onDelete();
            swipeableRef.current?.close();
          }
        }}
      >
        <IconSymbol name="trash" size={24} color="#fff" />
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      rightThreshold={40}
      overshootRight={false}
      renderRightActions={renderRightActions}
    >
      <View style={[styles.rowContent, containerStyle]}>{children}</View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  rowContent: {
    backgroundColor: "#fff",
  },
  deleteAction: {
    width: 70,
    height: "100%",
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
});
