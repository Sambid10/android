import React, { useState, useRef, useEffect } from 'react'
import { View, ActivityIndicator, Text, TextInput, StyleSheet, KeyboardAvoidingView, Pressable, ToastAndroid, Platform, Alert } from 'react-native'
import Button from '../../components/Button'
import { onGoogleButtonPress } from '../../utils/onGooglePressin'
import { Fonts } from '../../themes/font';
import { useResponsive } from '../../components/useLayout';
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod/v4"
import { Image } from 'react-native';
import { signInWithEmailAndPassword, getAuth } from '@react-native-firebase/auth';

const FormSchema = z.object({
  email: z.email(),
  password: z
    .string()
    // .min(8, "Password must be at least 8 characters")
    // .regex(/[a-z]/, "Must contain a lowercase letter")
    // .regex(/[A-Z]/, "Must contain an uppercase letter")
    // .regex(/[0-9]/, "Must contain a number")
    // .regex(/[^a-zA-Z0-9]/, "Must contain a special character"),
})

function showToast(message: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert(message);
  }
}

export default function AuthScreen() {
  const [emailLoading, setEmailLoading] = useState(false);
  const [focused,setFocused]=useState<"email" | "password" | null>(null)
  const [googleLoading, setGoogleLoading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const { handleSubmit, control, formState: { errors } } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const handleFormSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (emailLoading) return; // prevent double-submit
    setEmailLoading(true);
    try {
      await signInWithEmailAndPassword(getAuth(), data.email, data.password);
      showToast('Signed in successfully!');
      // success — no overlay here, NavigationController will swap screens
    } catch (error: any) {
      console.log('Sign-in error:', error.code, error.message);

      let message = 'Something went wrong. Please try again.';
      switch (error.code) {
        case 'auth/invalid-email':
          message = 'That email address looks invalid.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          message = 'Incorrect email or password.';
          break;
        case 'auth/too-many-requests':
          message = 'Too many attempts. Please try again later.';
          break;
      }
      showToast(message);
    } finally {
      if (isMounted.current) setEmailLoading(false);
    }
  }

  const { scaleFont } = useResponsive()

  const handleGoogleSignIn = async () => {
    if (googleLoading) return; // prevent double-submit
    setGoogleLoading(true);
    try {
      await onGoogleButtonPress();
      showToast('Signed in with Google!');
      // Don't setGoogleLoading(false) here on success —
      // keep the overlay up until this screen unmounts
      // (NavigationController will swap us to RootNaviagtion)
    } catch (error: any) {
      console.log('Google Sign-In error:', error.code, error.message);
      showToast('Google sign-in failed. Please try again.');
      if (isMounted.current) setGoogleLoading(false); // only reset on failure/cancel
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24, gap: 24, position: 'relative' }}>
      <View>
        <Text style={{ fontSize: scaleFont(45), fontFamily: Fonts.italic, color: "#A82323" }}>Welcome Back!</Text>
        <Text style={{ fontSize: scaleFont(40), fontFamily: Fonts.regular, color: "#121212" }}>Glad to see you again.</Text>
      </View>

      <View style={{ gap: 12 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontFamily: Fonts.regular, fontSize: scaleFont(14), color: "#121212" }}>
            Email:
          </Text>
          <Controller
            control={control}
            name='email'
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextInput
              onFocus={()=>setFocused("email")}
              onBlur={()=>setFocused(null)}
                style={[
                  styles.textinput,
                  { fontSize: scaleFont(16) },
                  errors.email && styles.inputError,
                  focused === "email" && styles.focusedinput
                ]}
                placeholder='Enter email'
                value={value}
                placeholderTextColor={"gray"}
                onChangeText={onChange}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}
        </View>

        <View style={{ gap: 4 }}>
          <Text style={{ fontFamily: Fonts.regular, fontSize: scaleFont(14), color: "#121212" }}>
            Password:
          </Text>
          <Controller
            control={control}
            name='password'
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextInput
              onFocus={()=>setFocused("password")}
              onBlur={()=>setFocused(null)}
                style={[
                  styles.textinput,
                  { fontSize: scaleFont(16) },
                  errors.password && styles.inputError,
                  focused === "password" && styles.focusedinput
                ]}
                placeholder='Enter Password'
                placeholderTextColor={"gray"}
                value={value}
                secureTextEntry
                onChangeText={onChange}
              />
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}
        </View>

      </View>
      <Pressable
        onPress={handleSubmit(handleFormSubmit)}
        disabled={emailLoading}
        style={({ pressed }) => ([{ backgroundColor: pressed ? "rgba(168, 35, 35, 0.08)" : "white", fontSize: scaleFont(16), opacity: emailLoading ? 0.6 : 1 }, styles.login])}>
        {emailLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={{ fontFamily: Fonts.regular, color: "white", fontSize: scaleFont(16) }}>Sign in</Text>
        )}
      </Pressable>

      <View style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <View style={{ width: "100%", height: 1, backgroundColor: "black" }} />
        <View style={{ position: "absolute", left: "50%", top: "50%", paddingHorizontal: 4, paddingVertical: 4, backgroundColor: "#F3F2EC", zIndex: 10, transform: [{ translateX: "-50%" }, { translateY: "-50%" }] }}>
          <Text style={{ fontFamily: Fonts.regular, fontSize: scaleFont(16) }}>or</Text>
        </View>
      </View>

      <Pressable
        onPress={handleGoogleSignIn}
        style={({ pressed }) => ([{ backgroundColor: pressed ? "rgba(168, 35, 35, 0.08)" : "white" }, styles.google])}>
        <Image
          style={{ height: 22, width: 22 }}
          source={require("../../assets/goog.png")} />
        <Text style={{ fontFamily: Fonts.regular, fontSize: scaleFont(16) }}>Sign in with Google</Text>
      </Pressable>

      {googleLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
            elevation: 999,
          }}
        >
          <View style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
            gap: 12,
          }}>
            <ActivityIndicator size="large" color="#A82323" />
            <Text style={{ fontWeight: '600', fontFamily: Fonts.regular, fontSize: 12 }}>Signing you in...</Text>
          </View>
        </View>
      )}

    </KeyboardAvoidingView>
  )
}
const styles = StyleSheet.create({
  textinput: {
    borderRadius: 8,
    height: 50,
    backgroundColor: "white",
    color: "black",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "gray",
    fontFamily: Fonts.regular,
  },
  inputError: {
    borderColor: "red",
  },
  focusedinput:{
    borderColor:"blue"
  },
  google: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 99,
    height: 45,
    color: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  login: {
    backgroundColor: "#A82323",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 99,
    height: 45,
    color: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  errorText: {
    color: "red",
    fontFamily: Fonts.regular,
    fontSize: 10,
  },
})