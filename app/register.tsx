import {
    SafeAreaView,
    ScrollView,
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
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'>
                <Text style={[styles.text, {color: theme.colors.text}]}>Email:</Text>
                <TextInput placeholder="abc@xyz.com"
                           onChangeText={setEmail}
                           value={email}
                           autoFocus
                           style={[emailInputStyle, {color: theme.colors.text}]}
                           autoCapitalize="none"
                           onFocus={() => setEmailInputStyle({...styles.textInput, borderColor: 'blue'})}
                           onBlur={() => {
                               setEmailInputStyle(styles.textInput);
                           }}
                />
                <Text style={[styles.text, {color: theme.colors.text}]}>Name:</Text>
                <TextInput placeholder="John Doe"
                           onChangeText={setName}
                           value={name}
                           style={[nameInputStyle, {color: theme.colors.text}]}
                           autoCapitalize="none"
                           onFocus={() => setNameInputStyle({...styles.textInput, borderColor: 'blue'})}
                           onBlur={() => {
                               setNameInputStyle(styles.textInput);
                           }}
                />
                <Text style={[styles.text, {color: theme.colors.text}]}>Password:</Text>
                <TextInput placeholder="********"
                           onChangeText={setPassword}
                           value={password}
                           secureTextEntry
                           textContentType='none'
                           autoComplete='off'
                           style={[passwordInputStyle, {color: theme.colors.text}]}
                           autoCapitalize="none"
                           onFocus={() => setPasswordInputStyle({...styles.textInput, borderColor: 'blue'})}
                           onBlur={() => {
                               setPasswordInputStyle(styles.textInput);
                           }}
                />
                <Text style={[styles.text, {color: theme.colors.text}]}>Password again:</Text>
                <TextInput placeholder="********"
                           onChangeText={setPasswordConfirm}
                           value={passwordConfirm}
                           secureTextEntry
                           textContentType='none'
                           autoComplete='off'
                           style={[passwordConfirmInputStyle, {color: theme.colors.text}]}
                           autoCapitalize="none"
                           onFocus={() => setPasswordConfirmInputStyle({...styles.textInput, borderColor: 'blue'})}
                           onBlur={() => {
                               setPasswordConfirmInputStyle(styles.textInput);
                           }}
                />
                {isLoading ? <>
                    <ActivityIndicator size='large' />
                </> : <>
                    <Pressable style={validInput ? styles.button : styles.defaultButton} onPress={() => {handleRegister()}} disabled={!validInput}>
                        <Text style={[styles.text, {color: theme.colors.text}]}>Sign up</Text>
                    </Pressable>
                </>}
                {error && <Text style={{color: 'red'}}>{error}</Text>}
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