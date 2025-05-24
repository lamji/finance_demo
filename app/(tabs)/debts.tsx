
import DebtManagerScreen from '@/components/screens/debts';

import useHeaderTheme from '@/hooks/useHeaderTheme';
import { StatusBar, StyleSheet, View } from 'react-native';

export default function Debts() {
  const { safeAreaBackground, theme } = useHeaderTheme();
  return (
    <>
      <StatusBar
        backgroundColor={safeAreaBackground}
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <View style={[styles.container, { backgroundColor: safeAreaBackground }]}>
        <DebtManagerScreen />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
  },
});