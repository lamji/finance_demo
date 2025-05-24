import { ThemedText } from '@/components/ThemedText';
import useHeaderTheme from '@/hooks/useHeaderTheme';
import { StatusBar, StyleSheet, View } from 'react-native';

export default function SettingsScreen() {
  const { safeAreaBackground, theme } = useHeaderTheme();
  return (
    <>
      <StatusBar backgroundColor={safeAreaBackground} barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={[styles.container, { backgroundColor: safeAreaBackground }]}>
        <ThemedText>Settings Screen</ThemedText>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});