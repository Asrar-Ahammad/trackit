import "@/global.css"
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import { styled } from 'nativewind'
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link href="/(auth)/sign-in" className="bg-accent p-4 text-white font-bold rounded mt-4">Login</Link>
      <Link href="/(auth)/sign-up" className="bg-accent p-4 text-white font-bold rounded mt-4">Register</Link>
      <Link href="/subscriptions/spotify" className="bg-accent p-4 text-white font-bold rounded mt-4">Spotify </Link>
      <Link href={{
        pathname:"/subscriptions/[id]",
        params:{id: "claude"}
      }} className="bg-accent p-4 text-white font-bold rounded mt-4">Claude Max Subscription</Link>
      </SafeAreaView>
  );
}
