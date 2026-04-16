import { colors } from "@/constants/theme";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export interface AuthButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary";
  testID?: string;
}

export default function AuthButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  testID,
}: AuthButtonProps) {
  const isPrimary = variant === "primary";
  const isDisabled = disabled || loading;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      className={`rounded-2xl py-3 px-6 items-center justify-center min-h-12 ${
        isPrimary ? "bg-accent" : "border border-accent bg-transparent"
      } ${isDisabled ? "opacity-50" : ""}`}
      style={{
        backgroundColor: isPrimary
          ? isDisabled
            ? colors.accent + "80"
            : colors.accent
          : "transparent",
        borderColor: colors.accent,
        borderWidth: isPrimary ? 0 : 2,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 16,
        minHeight: 48,
        opacity: isDisabled ? 0.5 : 1,
      }}
    >
      {loading ? (
        <View className="flex-row items-center gap-2">
          <ActivityIndicator
            color={isPrimary ? "#fff" : colors.accent}
            size="small"
          />
          <Text
            className={`text-base font-sans-semibold ${
              isPrimary ? "text-white" : "text-accent"
            }`}
            style={{
              color: isPrimary ? "#fff" : colors.accent,
            }}
          >
            {label}
          </Text>
        </View>
      ) : (
        <Text
          className={`text-base font-sans-semibold ${
            isPrimary ? "text-white" : "text-accent"
          }`}
          style={{
            color: isPrimary ? "#fff" : colors.accent,
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
