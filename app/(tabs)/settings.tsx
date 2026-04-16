import { AuthSignOutButton } from "@/components/auth";
import { colors } from "@/constants/theme";
import { useUser } from "@clerk/expo";
import { styled } from "nativewind";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { user } = useUser();

  return (
    <SafeAreaView
      className="flex-1 bg-background p-5"
      style={{ backgroundColor: colors.background }}
    >
      <View className="gap-6">
        {/* Header */}
        <View className="mb-4">
          <Text
            className="text-2xl font-sans-bold text-primary"
            style={{ color: colors.primary }}
          >
            Settings
          </Text>
        </View>

        {/* User Info Card */}
        {user && (
          <View
            className="rounded-2xl bg-card p-4 gap-2"
            style={{
              backgroundColor: colors.card,
            }}
          >
            <Text
              className="text-sm font-sans-medium text-muted-foreground"
              style={{ color: colors.mutedForeground }}
            >
              Email
            </Text>
            <Text
              className="text-base font-sans-semibold text-primary"
              style={{ color: colors.primary }}
            >
              {user.primaryEmailAddress?.emailAddress}
            </Text>
          </View>
        )}

        {/* Sign Out Section */}
        <View className="gap-3">
          <Text
            className="text-sm font-sans-semibold text-muted-foreground"
            style={{ color: colors.mutedForeground }}
          >
            Account
          </Text>
          <AuthSignOutButton />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
