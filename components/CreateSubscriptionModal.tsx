import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View
} from "react-native";

const CATEGORY_OPTIONS = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#ff6b6b",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#a8d8b8",
  Cloud: "#c9e4ca",
  Music: "#ffd6a5",
  Other: "#d4a5ff",
};

export interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateSubscription: (subscription: Omit<Subscription, "id">) => void;
}

export default function CreateSubscriptionModal({
  visible,
  onClose,
  onCreateSubscription,
}: CreateSubscriptionModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
  const [category, setCategory] = useState("Other");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCreateSubscription = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Subscription name is required";
    }

    if (!price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const now = dayjs();
    const renewalDate =
      frequency === "Monthly"
        ? now.add(1, "month").toISOString()
        : now.add(1, "year").toISOString();

    const newSubscription: Omit<Subscription, "id"> = {
      name: name.trim(),
      price: parseFloat(price),
      currency: "In",
      billing: frequency,
      frequency,
      category,
      status: "active",
      startDate: now.toISOString(),
      renewalDate,
      icon: icons.wallet,
      color: CATEGORY_COLORS[category],
      plan: category,
    };

    onCreateSubscription(newSubscription);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Other");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Overlay */}
        <Pressable
          className="modal-overlay"
          onPress={handleClose}
          style={{ flex: 0.15 }}
        />

        {/* Modal Container */}
        <View
          className="modal-container"
          style={{ backgroundColor: colors.background }}
        >
          {/* Header */}
          <View className="modal-header border-t-[1px]" style={{ borderColor: colors.border }}>
            <Text className="modal-title" style={{ color: colors.primary }}>
              New Subscription
            </Text>
            <Pressable
              className="modal-close"
              style={{ backgroundColor: colors.muted }}
              onPress={handleClose}
            >
              <Ionicons name="close" size={20} color={colors.primary} />
            </Pressable>
          </View>

          {/* Form Body */}
          <ScrollView
            className="modal-body"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* Name Field */}
            <View className="mb-4">
              <Text
                className="text-sm font-sans-semibold mb-2"
                style={{ color: colors.primary }}
              >
                Subscription Name
              </Text>
              <TextInput
                className="auth-input"
                style={{
                  borderColor: errors.name ? colors.destructive : colors.border,
                  color: colors.primary,
                  backgroundColor: "#fff",
                  padding:12,
                }}
                placeholder="Netflix"
                placeholderTextColor={colors.mutedForeground}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
              />
              {errors.name && (
                <Text
                  className="text-xs font-sans-medium mt-1"
                  style={{ color: colors.destructive }}
                >
                  {errors.name}
                </Text>
              )}
            </View>

            {/* Price Field */}
            <View className="mb-4">
              <Text
                className="text-sm font-sans-semibold mb-2"
                style={{ color: colors.primary }}
              >
                Price
              </Text>
              <TextInput
                className="auth-input"
                style={{
                  borderColor: errors.price
                    ? colors.destructive
                    : colors.border,
                  color: colors.primary,
                  backgroundColor: "#fff",
                  padding:12,
                }}
                placeholder="0.00"
                placeholderTextColor={colors.mutedForeground}
                value={price}
                onChangeText={(text) => {
                  setPrice(text);
                  if (errors.price) setErrors({ ...errors, price: "" });
                }}
                keyboardType="decimal-pad"
              />
              {errors.price && (
                <Text
                  className="text-xs font-sans-medium mt-1"
                  style={{ color: colors.destructive }}
                >
                  {errors.price}
                </Text>
              )}
            </View>

            {/* Frequency Picker */}
            <View className="mb-4">
              <Text
                className="text-sm font-sans-semibold mb-2"
                style={{ color: colors.primary }}
              >
                Billing Frequency
              </Text>
              <View className="picker-row">
                {(["Monthly", "Yearly"] as const).map((option) => (
                  <Pressable
                    key={option}
                    className={clsx(
                      "picker-option",
                      frequency === option && "picker-option-active",
                    )}
                    style={{
                      borderColor:
                        frequency === option ? colors.accent : colors.border,
                      backgroundColor:
                        frequency === option ? colors.accent + "10" : "#fff",
                    }}
                    onPress={() => setFrequency(option)}
                  >
                    <Text
                      className={clsx(
                        "picker-option-text",
                        frequency === option && "picker-option-text-active",
                      )}
                      style={{
                        color:
                          frequency === option
                            ? colors.accent
                            : colors.mutedForeground,
                      }}
                    >
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Category Chips */}
            <View>
              <Text
                className="text-sm font-sans-semibold mb-2"
                style={{ color: colors.primary }}
              >
                Category
              </Text>
              <View className="category-scroll">
                {CATEGORY_OPTIONS.map((option) => (
                  <Pressable
                    key={option}
                    className={clsx(
                      "category-chip",
                      category === option && "category-chip-active",
                    )}
                    style={{
                      borderColor:
                        category === option ? colors.accent : colors.border,
                      backgroundColor:
                        category === option ? colors.accent + "10" : "#fff",
                    }}
                    onPress={() => setCategory(option)}
                  >
                    <Text
                      className={clsx(
                        "category-chip-text",
                        category === option && "category-chip-text-active",
                      )}
                      style={{
                        color:
                          category === option
                            ? colors.accent
                            : colors.mutedForeground,
                      }}
                    >
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Submit Button */}
            <Pressable
              className={clsx(
                "auth-button",
                !name.trim() || !price.trim() ? "auth-button-disabled" : "",
              )}
              style={{
                backgroundColor:
                  !name.trim() || !price.trim()
                    ? colors.accent + "72"
                    : colors.accent,
                marginTop: 24,
              }}
              onPress={handleCreateSubscription}
              disabled={!name.trim() || !price.trim()}
            >
              <Text
                className="auth-button-text"
                style={{ color: colors.primary, fontWeight: "bold" }}
              >
                Create Subscription
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
