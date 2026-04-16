import { useClerk } from "@clerk/expo";
import React, { useState } from "react";
import AuthButton from "./AuthButton";

export interface AuthSignOutButtonProps {
  onSignOutComplete?: () => void;
}

export default function AuthSignOutButton({
  onSignOutComplete,
}: AuthSignOutButtonProps) {
  const { signOut } = useClerk();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      onSignOutComplete?.();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthButton
      label="Sign Out"
      onPress={handleSignOut}
      loading={loading}
      variant="secondary"
    />
  );
}
