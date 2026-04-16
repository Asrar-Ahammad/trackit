import { AuthButton, AuthCard, AuthInput, AuthText } from "@/components/auth";
import { colors } from "@/constants/theme";
import {
    formatClerkError,
    validateEmail,
    validatePassword,
    validateVerificationCode,
} from "@/lib/auth-validation";
import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import { styled } from 'nativewind'
const SafeAreaView = styled(RNSafeAreaView);

type SignInStep = "credentials" | "mfa";

export default function SignInScreen() {
  const { signIn } = useSignIn();
  const router = useRouter();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<SignInStep>("credentials");

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  // Handle sign-in with email and password
  const handleSignIn = async () => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    const newErrors: Record<string, string> = {};
    if (!emailValidation.valid) newErrors.email = emailValidation.error!;
    if (!passwordValidation.valid)
      newErrors.password = passwordValidation.error!;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setApiError("");
    setLoading(true);

    try {
      // Use the correct Clerk API: signIn.password()
      const { error } = await signIn!.password({
        emailAddress: email,
        password,
      });

      if (error) {
        setApiError(formatClerkError(error));
        return;
      }

      if (signIn!.status === "complete") {
        // Finalize the sign-in to secure the session
        await signIn!.finalize();
        // Sign in successful
        router.replace("/(tabs)");
      } else if (
        signIn!.status === "needs_second_factor" ||
        signIn!.status === "needs_client_trust"
      ) {
        // MFA required - send email code
        await signIn!.mfa.sendEmailCode();
        setStep("mfa");
      } else {
        setApiError("Sign in failed. Please try again.");
      }
    } catch (err: any) {
      setApiError(formatClerkError(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle MFA code submission
  const handleMFASubmit = async () => {
    const validation = validateVerificationCode(code);
    if (!validation.valid) {
      setErrors({ code: validation.error! });
      return;
    }

    setErrors({});
    setApiError("");
    setLoading(true);

    try {
      // Verify MFA code using correct Clerk API
      const { error } = await signIn!.mfa.verifyEmailCode({ code });

      if (error) {
        setApiError(formatClerkError(error));
        return;
      }

      if (signIn!.status === "complete") {
        // Finalize the sign-in to secure the session
        await signIn!.finalize();
        // Sign in successful
        router.replace("/(tabs)");
      } else {
        setApiError("Verification failed. Please try again.");
      }
    } catch (err: any) {
      setApiError(formatClerkError(err));
    } finally {
      setLoading(false);
    }
  };

  // Reset to credentials step
  const handleReset = () => {
    setStep("credentials");
    setCode("");
    setErrors({});
    setApiError("");
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background }}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-8 items-center">
          {/* App Logo/Branding */}
          <AuthText variant="title" className="text-center">
            Welcome Back
          </AuthText>
          <AuthText variant="body" className="mt-2 text-center">
            Sign in to your account
          </AuthText>
        </View>

        {/* API Error */}
        {apiError && (
          <View
            className="mb-4 rounded-2xl border border-destructive bg-red-50 p-4"
            style={{
              borderColor: colors.destructive,
              backgroundColor: colors.destructive + "10",
            }}
          >
            <AuthText variant="error">{apiError}</AuthText>
          </View>
        )}

        {/* Form Card */}
        <AuthCard>
          {step === "credentials" && (
            <View className="gap-6">
              <AuthInput
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email}
                testID="email-input"
              />

              <AuthInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                secureTextEntry={true}
                autoCapitalize="none"
                autoComplete="password"
                error={errors.password}
                testID="password-input"
              />

              <AuthButton
                label="Sign in"
                onPress={handleSignIn}
                loading={loading}
                disabled={!email.trim() || !password.trim() || loading}
                testID="signin-submit"
              />

              {/* Social Sign-in Options */}
              <View className="gap-3">
                <View className="flex-row items-center gap-3">
                  <View
                    className="flex-1 border-b"
                    style={{ borderColor: colors.border }}
                  />
                  <AuthText variant="hint">Or continue with</AuthText>
                  <View
                    className="flex-1 border-b"
                    style={{ borderColor: colors.border }}
                  />
                </View>

                <AuthButton
                  label="Google"
                  variant="secondary"
                  onPress={() => setApiError("Google sign-in coming soon")}
                  disabled={loading}
                />

                <AuthButton
                  label="Apple ID"
                  variant="secondary"
                  onPress={() => setApiError("Apple ID sign-in coming soon")}
                  disabled={loading}
                />
              </View>
            </View>
          )}

          {step === "mfa" && (
            <View className="gap-6">
              <View>
                <AuthText variant="subtitle" className="mb-4">
                  Verify Your Identity
                </AuthText>
                <AuthText variant="hint" className="text-muted-foreground">
                  We sent a verification code to your email
                </AuthText>
              </View>

              <AuthInput
                label="Verification Code"
                placeholder="000000"
                value={code}
                onChangeText={(text) => {
                  setCode(text);
                  if (errors.code) setErrors({ ...errors, code: "" });
                }}
                keyboardType="numeric"
                autoCapitalize="none"
                maxLength={6}
                error={errors.code}
                testID="mfa-input"
              />

              <AuthButton
                label="Verify"
                onPress={handleMFASubmit}
                loading={loading}
                disabled={!code.trim() || loading}
                testID="mfa-submit"
              />

              <Pressable onPress={handleReset} disabled={loading}>
                <AuthText variant="link" className="text-center">
                  Back to sign in
                </AuthText>
              </Pressable>
            </View>
          )}
        </AuthCard>

        {/* Sign Up Link */}
        {step === "credentials" && (
          <View className="mt-8 flex-row items-center justify-center gap-2">
            <AuthText variant="body">Don&apos;t have an account? </AuthText>
            <Link href="/(auth)/sign-up">
              <AuthText variant="link">Sign up</AuthText>
            </Link>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
