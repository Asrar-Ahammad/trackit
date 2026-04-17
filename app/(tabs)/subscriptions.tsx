import SubscriptionCard from "@/components/SubscriptionCard";
import { colors } from "@/constants/theme";
import { useSubscriptions } from "@/lib/subscriptions-context";
import { Ionicons } from "@expo/vector-icons";
import { styled } from "nativewind";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const SubscriptionsScreen = () => {
  const { subscriptions } = useSubscriptions();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  // Filter subscriptions based on search query
  const filteredSubscriptions = useMemo(() => {
    if (!searchQuery.trim()) {
      return subscriptions;
    }

    const query = searchQuery.toLowerCase();
    return subscriptions.filter(
      (sub) =>
        sub.name.toLowerCase().includes(query) ||
        sub.category?.toLowerCase().includes(query) ||
        sub.plan?.toLowerCase().includes(query),
    );
  }, [searchQuery, subscriptions]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="p-5">
        <Text className="text-4xl mb-6 font-sans-bold">Subscriptions</Text>
        {/* Search Bar */}
        <View
          className="flex-row items-center rounded-2xl border-[1px] px-4 py-3"
          style={{ borderColor: colors.border, backgroundColor: "#fff" }}
        >
          <Ionicons name="search" size={20} color={colors.mutedForeground} />
          <TextInput
            className="flex-1 ml-3 text-base"
            placeholder="Search subscriptions..."
            placeholderTextColor={colors.mutedForeground}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ color: colors.primary }}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={handleClearSearch} className="p-1">
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.mutedForeground}
              />
            </Pressable>
          )}
        </View>

        {/* Results count */}
        {searchQuery.length > 0 && (
          <Text
            className="mt-3 text-sm font-sans-medium"
            style={{ color: colors.mutedForeground }}
          >
            Found {filteredSubscriptions.length} subscription
            {filteredSubscriptions.length !== 1 ? "s" : ""}
          </Text>
        )}
      </View>

      {/* Subscriptions List */}
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
          />
        )}
        extraData={expandedSubscriptionId}
        contentContainerClassName="pb-30 px-5"
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-10">
            <Ionicons
              name="search"
              size={48}
              color={colors.mutedForeground}
              style={{ opacity: 0.5, marginBottom: 12 }}
            />
            <Text
              className="text-center text-base font-sans-medium"
              style={{ color: colors.mutedForeground }}
            >
              {searchQuery.length > 0
                ? "No subscriptions found"
                : "No subscriptions yet"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default SubscriptionsScreen;
