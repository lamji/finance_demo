import AddDebtScreen from '@/components/screens/debt/AddDebtScreen';
import { Stack } from 'expo-router';

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
