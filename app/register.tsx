import {SafeAreaView, useColorScheme, Platform,} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {router} from "expo-router";
import axios from "@/scripts/axiosConfig";
import {StatusBar} from "expo-status-bar";
import {BigButton, EditContainer, VerticalContainer} from "@/tamagui.config";
import {H4, Input, Label, ScrollView, Separator, SizableText, Spinner} from "tamagui";

export default  function Register() {

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [validInput, setValidInput] = useState(false);

    const handleRegister = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/register', {
                email: email,
                name: name,
                password: password,
                password_confirmation: passwordConfirm,
            });
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response?.data?.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 201) {
                router.back();
            }
        }
    }

    useEffect(() => {
        if (email.length > 0 && name.length > 0 && password.length > 7 && password === passwordConfirm && email.includes('@') && email.includes('.')) {
            setValidInput(true);
        } else {
            setValidInput(false);
        }
    }, [email, name, password, passwordConfirm]);

    return (
        <SafeAreaView>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
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
                            backgroundColor={theme.colors.card}
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
                        <Label htmlFor="name">
                            <H4>Name</H4>
                        </Label>
                        <Input
                            backgroundColor={theme.colors.card}
                            id="name"
                            flex={1}
                            borderWidth={2}
                            placeholder="John Doe"
                            onChangeText={setName}
                            value={name}
                            autoCapitalize="words"
                        />
                    </VerticalContainer>
                    <Separator />
                    <VerticalContainer>
                        <Label htmlFor="password">
                            <H4>Password</H4>
                        </Label>
                        <Input
                            backgroundColor={theme.colors.card}
                            id="password"
                            flex={1}
                            borderWidth={2}
                            placeholder="********"
                            onChangeText={setPassword}
                            value={password}
                            secureTextEntry
                            autoCapitalize="none"
                            textContentType='oneTimeCode'
                        />
                    </VerticalContainer>
                    <Separator />
                    <VerticalContainer>
                        <Label htmlFor="password2">
                            <H4>Password again</H4>
                        </Label>
                        <Input
                            backgroundColor={theme.colors.card}
                            id="password2"
                            flex={1}
                            borderWidth={2}
                            placeholder="********"
                            onChangeText={setPasswordConfirm}
                            value={passwordConfirm}
                            secureTextEntry
                            autoCapitalize="none"
                            textContentType='oneTimeCode'
                        />
                    </VerticalContainer>
                    <SizableText color="$red1">{error}</SizableText>
                    <Separator />
                    <BigButton onPress={() => {handleRegister()}} disabled={!validInput}>{isLoading ? <Spinner /> : "Sign up"}</BigButton>
                </EditContainer>
            </ScrollView>
        </SafeAreaView>
    )
};