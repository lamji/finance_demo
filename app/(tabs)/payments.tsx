import { StatusBar } from "react-native";

import PaymentScreen from "@/components/screens/payment";

export default function PaymentsScreen() {
  return (
    <>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <PaymentScreen />
    </>
  );
}
