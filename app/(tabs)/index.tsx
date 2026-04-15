import "@/global.css"
import { Link } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import { styled } from 'nativewind'
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-4xl text-primary font-sans-extrabold">
        Home
      </Text>
      <Link href="/onboarding" className="bg-accent p-4 text-white rounded mt-4 font-sans-extrabold">Go to Onboarding</Link>
      <Link href="/(auth)/sign-in" className="bg-accent p-4 text-white rounded mt-4 font-sans-extrabold">Login</Link>
      <Link href="/(auth)/sign-up" className="bg-accent p-4 text-white rounded mt-4 font-sans-extrabold">Register</Link>

      </SafeAreaView>
  );
}
