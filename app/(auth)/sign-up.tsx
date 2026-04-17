import {
    AuthButton,
    AuthCard,
    AuthInput,
    AuthPasswordInput,
    AuthText,
} from "@/components/auth";
import { colors } from "@/constants/theme";
import {
    formatClerkError,
    validateEmail,
    validatePassword,
    validateVerificationCode,
} from "@/lib/auth-validation";
import { useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

type SignUpStep = "credentials" | "verify";

export default function SignUpScreen() {
  const { signUp } = useSignUp();
  const router = useRouter();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<SignUpStep>("credentials");

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  // Handle email and password submission - combines both fields
  const handleEmailSubmit = async () => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setErrors({ email: emailValidation.error! });
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setErrors({ password: passwordValidation.error! });
      return;
    }

    setErrors({});
    setApiError("");
    setLoading(true);

    try {
      // Use the correct Clerk API: signUp.password()
      const { error } = await signUp!.password({
        emailAddress: email,
        password,
      });

      if (error) {
        setApiError(formatClerkError(error));
        return;
      }

      // If successful, send verification email
      if (!error) {
        await signUp!.verifications.sendEmailCode();
        setStep("verify");
      }
    } catch (err: any) {
      setApiError(formatClerkError(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle verification code submission
  const handlePasswordSubmit = async () => {
    const validation = validateVerificationCode(code);
    if (!validation.valid) {
      setErrors({ code: validation.error! });
      return;
    }

    setErrors({});
    setApiError("");
    setLoading(true);

    try {
      // Verify email code using correct Clerk API
      await signUp!.verifications.verifyEmailCode({
        code,
      });

      // Check if sign-up is complete
      if (signUp!.status === "complete") {
        // Finalize the sign-up to create the session
        await signUp!.finalize();
        // Navigate to home after successful sign-up
        router.replace("/(tabs)");
      } else {
        setApiError("Sign-up incomplete. Please try again.");
      }
    } catch (err: any) {
      setApiError(formatClerkError(err));
    } finally {
      setLoading(false);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    setApiError("");
    setLoading(true);

    try {
      // Resend email code using correct Clerk API
      await signUp!.verifications.sendEmailCode();
      setApiError("");
    } catch (err: any) {
      setApiError(formatClerkError(err));
    } finally {
      setLoading(false);
    }
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
            Create Account
          </AuthText>
          <AuthText variant="body" className="mt-2 text-center">
            Smart subscription tracking
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
              <View>
                <AuthText variant="subtitle" className="mb-4">
                  Create your account
                </AuthText>
                <AuthText variant="hint" className="text-muted-foreground">
                  Sign up with email and password
                </AuthText>
              </View>

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

              <AuthPasswordInput
                label="Password"
                placeholder="At least 8 characters"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                autoCapitalize="none"
                autoComplete="password"
                error={errors.password}
                testID="password-input"
              />

              <AuthButton
                label="Sign Up"
                onPress={handleEmailSubmit}
                loading={loading}
                disabled={!email.trim() || !password.trim() || loading}
                testID="signup-submit"
              />

              {/* Social Sign-up Options */}
              <View className="gap-3">
                <View className="flex-row items-center gap-3">
                  <View
                    className="flex-1 border-b"
                    style={{ borderColor: colors.border }}
                  />
                  <AuthText variant="hint">Or sign up with</AuthText>
                  <View
                    className="flex-1 border-b"
                    style={{ borderColor: colors.border }}
                  />
                </View>

                <AuthButton
                  label="Google"
                  variant="secondary"
                  onPress={() => setApiError("Google sign-up coming soon")}
                  disabled={loading}
                />

                <AuthButton
                  label="Apple ID"
                  variant="secondary"
                  onPress={() => setApiError("Apple ID sign-up coming soon")}
                  disabled={loading}
                />
              </View>
            </View>
          )}

          {step === "verify" && (
            <View className="gap-6">
              <View>
                <AuthText variant="subtitle" className="mb-4">
                  Verify your email
                </AuthText>
                <AuthText variant="hint" className="text-muted-foreground">
                  We sent a verification code to {email}
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
                testID="code-input"
              />

              <AuthButton
                label="Verify & Create Account"
                onPress={handlePasswordSubmit}
                loading={loading}
                disabled={!code.trim() || loading}
                testID="verify-submit"
              />

              <Pressable onPress={handleResendCode} disabled={loading}>
                <AuthText variant="link" className="text-center text-sm">
                  Didn&apos;t receive a code? Resend
                </AuthText>
              </Pressable>

              <Pressable
                onPress={() => setStep("credentials")}
                disabled={loading}
              >
                <AuthText variant="hint" className="text-center">
                  Change email
                </AuthText>
              </Pressable>
            </View>
          )}
        </AuthCard>

        {/* Sign In Link */}
        {step === "credentials" && (
          <View className="mt-8 flex-row items-center justify-center gap-2">
            <AuthText variant="body">Already have an account? </AuthText>
            <Link href="/(auth)/sign-in">
              <AuthText variant="link">Sign in</AuthText>
            </Link>
          </View>
        )}

        {/* Required for Clerk's bot sign-up protection */}
        <View nativeID="clerk-captcha" />
      </ScrollView>
    </SafeAreaView>
  );
}
