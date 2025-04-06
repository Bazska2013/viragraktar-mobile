import {SafeAreaView, useColorScheme, Platform} from "react-native";
import {useEffect, useState} from "react";
import * as SecureStore from 'expo-secure-store';
import {router} from "expo-router";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import axios from '../scripts/axiosConfig';
import CookieManager from '@react-native-cookies/cookies';
import {H4, Input, Label, Separator, SizableText, Spinner} from 'tamagui';
import {BigButton, EditContainer, SmallButton, VerticalContainer} from "@/tamagui.config";
import {ScrollView} from "tamagui";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [validInput, setValidInput] = useState(false);

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    async function save(key: string, value: any) {
        await SecureStore.setItemAsync(key, value);
    }

    const handleLogin = async () => {
        let response;
        setIsLoading(true);
        setError('');
        await CookieManager.clearAll();
        try {
            response = await axios.post('/api/login', {
                email: email,
                password: password,
                device_name: Platform.OS,
            });
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response?.data?.message);
        } finally {
            let token;
            setIsLoading(false);
            if (typeof response?.data === 'string') {
                token = response.data.split('|')[1];
            } else {
                token = response?.data?.token;
            }
            if (token) {
                await save('token', token);
                await getUserData();
                router.replace('/(tabs)/(sell)');
            }
        }
    }

    const getUserData = async () => {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
            try {
                const response = await axios.get('/api/user');
                await save('user', JSON.stringify(response.data));
            } catch (error: any) {
                console.log(error.response.data.message);
            }
            try {
                const response = await axios.get('/api/store');
                if (response.status === 200 && Object.keys(response.data).length > 0) {
                    await save('store', JSON.stringify(response.data));
                }
            } catch (error: any) {
                console.log(error.response.data.message);
            }
        } else {
            router.replace('/login');
        }
    }

    useEffect(() => {
        if (email.length > 0 && password.length > 7 && email.includes('@') && email.includes('.')) {
            setValidInput(true);
        } else {
            setValidInput(false);
        }
    }, [email, password]);

    return (
        <SafeAreaView>
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'
                        automaticallyAdjustKeyboardInsets={true}
            >
                <EditContainer
                    backgroundColor={theme.colors.card}
                >
                    <VerticalContainer>
                        <Label htmlFor="email">
                            <H4>Email</H4>
                        </Label>
                        <Input
                            id="email"
                            flex={1}
                            borderWidth={2}
                            placeholder="abc@xyz.com"
                            onChangeText={setEmail}
                            value={email}
                            autoFocus
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </VerticalContainer>
                    <Separator />
                    <VerticalContainer>
                        <Label htmlFor="password">
                            <H4>Password</H4>
                        </Label>
                        <Input
                            id="password"
                            flex={1}
                            borderWidth={2}
                            placeholder="********"
                            onChangeText={setPassword}
                            value={password}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </VerticalContainer>
                    <Separator />
                    <SizableText color="$red1">{error}</SizableText>
                    <BigButton onPress={() => {handleLogin()}} disabled={!validInput}>{isLoading ? <Spinner /> : "Sign in"}</BigButton>
                    <Separator />
                    <SizableText>Don't have an account yet?</SizableText>
                    <SmallButton onPress={() => {router.push('/register')}}>Sign up</SmallButton>
                </EditContainer>
            </ScrollView>
        </SafeAreaView>
    )
}