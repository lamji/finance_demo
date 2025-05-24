import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function useHeaderTheme() {
  const theme = useColorScheme() ?? "light";
  const tintColor = Colors[theme].tint;
  const headerBgColors = { light: "#0a7ea4", dark: "#1D3D47" };

  const headerConfig = {
    backgroundColor: headerBgColors,
    userName: "John Doe",
    safeAreaBackground: headerBgColors[theme],
  };

  return {
    theme,
    tintColor,
    headerConfig,
    headerBgColors,
    safeAreaBackground: headerBgColors[theme],
  };
}
