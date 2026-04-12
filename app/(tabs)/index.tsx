import "@/global.css"
import { Link } from "expo-router";
import { Text, View } from "react-native";
 
export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
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
      </View>
  );
}
