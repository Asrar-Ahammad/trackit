import { colors } from "@/constants/theme";
import React from "react";
import { Text, TextInput, View } from "react-native";

export interface AuthInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  editable?: boolean;
  error?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: "email" | "password" | "off";
  testID?: string;
}

export default function AuthInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  editable = true,
  error,
  autoCapitalize = "none",
  autoComplete = "off",
  testID,
}: AuthInputProps) {
  return (
    <View className="w-full">
      <Text
        className="mb-2 text-base font-sans-semibold text-primary"
        style={{ color: colors.primary }}
      >
        {label}
      </Text>
      <TextInput
        testID={testID}
        className="rounded-2xl border border-border bg-white px-4 py-3 text-base text-primary placeholder-muted-foreground"
        style={{
          borderColor: error ? colors.destructive : colors.border,
          color: colors.primary,
          backgroundColor: "#fff",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 16,
          borderWidth: 1,
        }}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        editable={editable}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
      />
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
