import {SplashScreen, Stack} from "expo-router";
import {useColorScheme} from "react-native";
import {useEffect} from "react";
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import {StatusBar} from "expo-status-bar";
import {StyleSheet} from "react-native";

export default function RootLayout() {

    const colorScheme = useColorScheme();

  return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{headerShown: false}} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="login" options={{headerBackTitle: 'Back', title: 'Sign in'}} />
          <Stack.Screen name="register" options={{headerBackTitle: 'Sign in', title: 'Sign up', presentation: 'modal'}} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
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