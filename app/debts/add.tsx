import { Stack } from 'expo-router';
import AddDebtScreen from '@/components/screens/debt/AddDebtScreen';

export default function AddDebt() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Add New Debt',
          headerBackTitle: 'Back'
        }} 
      />
      <AddDebtScreen />
    </>
  );
}
