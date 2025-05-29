// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

export type IconSymbolName =
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
  | "lock"
  | "calendar"
  | "rectangle.portrait.and.arrow.right"
  | "person.crop.circle.fill"
  | "icloud.fill"
  | "icloud.slash.fill"
  | "person.2.fill"
  | "person.fill"
  | "xmark.circle.fill"
  | "arrow.down.circle.fill"
  | "arrow.up.circle.fill"
  | "checkmark.seal.fill"
  | "plus.circle.fill"
  | "cloud.fill"
  | "arrow.down.left.circle.fill"
  | "arrow.up.right.circle.fill"
  | "doc.text.fill"
  | "square.and.pencil"
  | "list.bullet"
  | "checkmark.circle"
  | "exclamationmark.circle"
  | "exclamationmark.circle.fill"
  | "clock.fill";

type IconMapping = Record<
  IconSymbolName,
  ComponentProps<typeof MaterialIcons>["name"]
>;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "dashboard",
  "paperplane.fill": "account-balance",
  "creditcard.fill": "payments",
  "person.circle.fill": "person",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  circle: "radio-button-unchecked",
  "checkmark.circle.fill": "check-circle",
  "bell.fill": "notifications",
  gear: "settings",
  xmark: "close",
  "chevron.left": "chevron-left",
  trash: "delete",
  "bell.slash": "notifications-off",
  clock: "schedule",
  envelope: "email",
  lock: "lock",
  calendar: "calendar-today", // Add this line
  "rectangle.portrait.and.arrow.right": "logout", // Add this line - using "logout" as the Material equivalent
  "person.crop.circle.fill": "account-circle",
  "icloud.fill": "cloud",
  "icloud.slash.fill": "cloud-off",
  "person.2.fill": "people",
  "person.fill": "person",
  "xmark.circle.fill": "cancel",
  "arrow.down.circle.fill": "arrow-circle-down",
  "arrow.up.circle.fill": "arrow-circle-up",
  "checkmark.seal.fill": "verified", // Using "verified" as Material equivalent
  "plus.circle.fill": "add-circle", // Using "add-circle" as Material equivalent
  "cloud.fill": "cloud", // Add this line - using "cloud" as Material equivalent
  "arrow.down.left.circle.fill": "arrow-circle-down", // For incoming/received
  "arrow.up.right.circle.fill": "arrow-circle-up", // For outgoing/sent
  "doc.text.fill": "description", // Add this line - using "description" as Material equivalent
  "square.and.pencil": "edit",
  "list.bullet": "list",
  "checkmark.circle": "check-circle-outline",
  "exclamationmark.circle": "error-outline",
  "exclamationmark.circle.fill": "error",
  "clock.fill": "access-time-filled",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
