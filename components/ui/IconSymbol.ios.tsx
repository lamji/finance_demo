import { SymbolView, SymbolWeight } from "expo-symbols";
import { StyleProp, ViewStyle } from "react-native";

type IconSymbolName =
  | "house.fill"
  | "paperplane.fill"
  | "creditcard.fill"
  | "person.circle.fill"
  | "chevron.left.forwardslash.chevron.right"
  | "chevron.right"
  | "circle"
  | "checkmark.circle.fill"
  | "bell.fill"
  | "gear"
  | "xmark"
  | "chevron.left"
  | "trash"
  | "bell.slash"
  | "clock"
  | "envelope"
  | "lock";

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = "regular",
}: {
  name: IconSymbolName;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
