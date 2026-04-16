import { colors } from "@/constants/theme";
import React from "react";
import { View, ViewProps } from "react-native";

export interface AuthCardProps extends ViewProps {
  children: React.ReactNode;
}

export default function AuthCard({ children, style, ...props }: AuthCardProps) {
  return (
    <View
      {...props}
      className="w-full rounded-3xl bg-card p-6"
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: 24,
          padding: 24,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
