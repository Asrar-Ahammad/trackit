import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface SubscriptionsContextType {
  subscriptions: Subscription[];
  addSubscription: (subscription: Omit<Subscription, "id">) => void;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
}

const SubscriptionsContext = createContext<
  SubscriptionsContextType | undefined
>(undefined);

export function SubscriptionsProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(HOME_SUBSCRIPTIONS);

  const addSubscription = (newSubscription: Omit<Subscription, "id">) => {
    const id = `sub-${Date.now()}`;
    const subscription: Subscription = { id, ...newSubscription };
    setSubscriptions((prev) => [subscription, ...prev]);
  };

  const updateSubscription = (
    id: string,
    updatedFields: Partial<Subscription>,
  ) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, ...updatedFields } : sub)),
    );
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
  };

  return (
    <SubscriptionsContext.Provider
      value={{
        subscriptions,
        addSubscription,
        updateSubscription,
        deleteSubscription,
      }}
    >
      {children}
    </SubscriptionsContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionsContext);
  if (!context) {
    throw new Error(
      "useSubscriptions must be used within a SubscriptionsProvider",
    );
  }
  return context;
}
