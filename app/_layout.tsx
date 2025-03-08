import {SplashScreen, Stack} from "expo-router";
import {useColorScheme, Button} from "react-native";
import {useEffect} from "react";
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import {StatusBar} from "expo-status-bar";
import {StyleSheet} from "react-native";
import {router} from "expo-router";
import { TamaguiProvider} from "tamagui";

import { tamaguiConfig } from "@/tamagui.config";

export default function RootLayout() {

    const colorScheme = useColorScheme();

  return (
      <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack>
                  <Stack.Screen name="(tabs)" options={{headerShown: false}} />
                  <Stack.Screen name="+not-found" />
                  <Stack.Screen name="login" options={{headerBackTitle: 'Back', title: 'Sign in'}} />
                  <Stack.Screen name="register" options={{headerBackTitle: 'Sign in', title: 'Sign up', presentation: 'modal', headerLeft: () => <Button title="Cancel" onPress={() => router.back()} />}} />
              </Stack>
              <StatusBar style="auto" />
          </ThemeProvider>
      </TamaguiProvider>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
});