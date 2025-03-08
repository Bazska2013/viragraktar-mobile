import {
    SafeAreaView,
    StyleSheet,
    useColorScheme,
    Text,
    TextInput,
    Pressable,
    Platform,
    ActivityIndicator
} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {router} from "expo-router";
import axios from "@/scripts/axiosConfig";
import {StatusBar} from "expo-status-bar";
import {BigButton, EditContainer, VerticalContainer} from "@/tamagui.config";
import {Input, Label, ScrollView, Spinner} from "tamagui";

export default  function Register() {

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const [email, setEmail] = useState('');
    const [emailInputStyle, setEmailInputStyle] = useState(styles.textInput);
    const [name, setName] = useState('');
    const [nameInputStyle, setNameInputStyle] = useState(styles.textInput);
    const [password, setPassword] = useState('');
    const [passwordInputStyle, setPasswordInputStyle] = useState(styles.textInput);
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [passwordConfirmInputStyle, setPasswordConfirmInputStyle] = useState(styles.textInput);
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
            router.back();
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
                <EditContainer>
                    <VerticalContainer>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            flex={1}
                            // size="$3"
                            borderWidth={2}
                            // isInvalid={!!errors.name}
                            placeholder="abc@xyz.com"
                            onChangeText={setEmail}
                            value={email}
                            autoFocus
                            autoCapitalize="none"
                        />
                    </VerticalContainer>
                    <VerticalContainer>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            flex={1}
                            // size="$3"
                            borderWidth={2}
                            // isInvalid={!!errors.name}
                            placeholder="John Doe"
                            onChangeText={setName}
                            value={name}
                            autoCapitalize="words"
                        />
                    </VerticalContainer>
                    <VerticalContainer>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            flex={1}
                            // size="$3"
                            borderWidth={2}
                            // isInvalid={!!errors.name}
                            placeholder="********"
                            onChangeText={setPassword}
                            value={password}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </VerticalContainer>
                    <VerticalContainer>
                        <Label htmlFor="password2">Password again</Label>
                        <Input
                            id="password2"
                            flex={1}
                            // size="$3"
                            borderWidth={2}
                            // isInvalid={!!errors.name}
                            placeholder="********"
                            onChangeText={setPasswordConfirm}
                            value={passwordConfirm}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </VerticalContainer>
                    {/*<SizableText>{error}</SizableText>*/}
                    <VerticalContainer marginTop={40}>
                        <BigButton onPress={() => {handleRegister()}} disabled={!validInput}>{isLoading ? <Spinner /> : "Sign up"}</BigButton>
                    </VerticalContainer>
                </EditContainer>
            </ScrollView>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    text: {
        margin: 10,
        fontSize: 20,
    },
    textInput: {
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
    },
    button: {
        backgroundColor: 'lightblue',
        padding: 10,
        margin: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    defaultButton: {
        backgroundColor: 'lightgrey',
        padding: 10,
        margin: 10,
        alignItems: 'center',
        borderRadius: 5,
    }
});