import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export interface AuthPasswordInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
  error?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: "password" | "off";
  testID?: string;
}

export default function AuthPasswordInput({
  label,
  placeholder,
  value,
  onChangeText,
  editable = true,
  error,
  autoCapitalize = "none",
  autoComplete = "password",
  testID,
}: AuthPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="w-full">
      <Text
        className="mb-2 text-base font-sans-semibold text-primary"
        style={{ color: colors.primary }}
      >
        {label}
      </Text>
      <View
        className="relative flex-row items-center rounded-2xl border border-border bg-white"
        style={{
          borderColor: error ? colors.destructive : colors.border,
          backgroundColor: "#fff",
          borderRadius: 16,
          borderWidth: 1,
        }}
      >
        <TextInput
          testID={testID}
          className="flex-1 px-4 py-3 text-base text-primary placeholder-muted-foreground"
          style={{
            color: colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          keyboardType="default"
          editable={editable}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
        />
        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          className="mr-4 p-2"
          testID={`${testID}-toggle`}
        >
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color={colors.mutedForeground}
          />
        </Pressable>
      </View>
      {error && (
        <Text
          className="mt-1 text-sm font-sans-medium text-destructive"
          style={{ color: colors.destructive }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
