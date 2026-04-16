import { colors } from "@/constants/theme";
import React from "react";
import { Text, TextProps } from "react-native";

export interface AuthTextProps extends TextProps {
  variant?: "title" | "subtitle" | "label" | "body" | "hint" | "error" | "link";
  children: React.ReactNode;
}

export default function AuthText({
  variant = "body",
  children,
  style,
  ...props
}: AuthTextProps) {
  let className = "";
  let textColor = colors.primary;

  switch (variant) {
    case "title":
      className = "text-2xl font-sans-bold";
      textColor = colors.primary;
      break;
    case "subtitle":
      className = "text-lg font-sans-semibold";
      textColor = colors.primary;
      break;
    case "label":
      className = "text-base font-sans-semibold";
      textColor = colors.primary;
      break;
    case "body":
      className = "text-base font-sans-regular";
      textColor = colors.mutedForeground;
      break;
    case "hint":
      className = "text-sm font-sans-regular";
      textColor = colors.mutedForeground;
      break;
    case "error":
      className = "text-sm font-sans-medium";
      textColor = colors.destructive;
      break;
    case "link":
      className = "text-base font-sans-semibold";
      textColor = colors.accent;
      break;
  }

  return (
    <Text
      {...props}
      className={className}
      style={[{ color: textColor }, style]}
    >
      {children}
    </Text>
  );
}
