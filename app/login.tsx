import {SafeAreaView, Text, TextInput, StyleSheet, Pressable, ScrollView, useColorScheme, Platform} from "react-native";
import {useState} from "react";
import * as SecureStore from 'expo-secure-store';
import {router} from "expo-router";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import axios from '../scripts/axiosConfig';
import CookieManager from '@react-native-cookies/cookies';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailInputStyle, setEmailInputStyle] = useState(styles.textInput);
    const [passwordInputStyle, setPasswordInputStyle] = useState(styles.textInput);
    const [error, setError] = useState('');

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    async function save(key: string, value: any) {
        await SecureStore.setItemAsync(key, value);
    }

    const handleLogin = async () => {
        let response;
        await CookieManager.clearAll();
        try {
            response = await axios.post('/api/login', {
                email: email,
                password: password,
                device_name: Platform.OS,
            });
        } catch (error: any) {
            setError(error.response?.data?.message);
        } finally {
            let token;
            if (typeof response?.data === 'string') {
                token = response.data.split('|')[1];
            } else {
                token = response?.data?.token;
            }
            if (token) {
                await save('token', token);
                router.replace('/');
            }
        }
    }

    return (
            <SafeAreaView>
                <ScrollView style={{height: '100%'}}>
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
                    <Text style={[styles.text, {color: theme.colors.text}]}>Password:</Text>
                    <TextInput placeholder="********"
                               onChangeText={setPassword}
                               value={password}
                               secureTextEntry
                               style={[passwordInputStyle, {color: theme.colors.text}]}
                               autoCapitalize="none"
                               onFocus={() => setPasswordInputStyle({...styles.textInput, borderColor: 'blue'})}
                               onBlur={() => {
                                   setPasswordInputStyle(styles.textInput);
                               }}
                    />
                    <Pressable style={styles.button} onPress={() => {handleLogin()}}>
                        <Text>Log in</Text>
                    </Pressable>
                    {error && <Text style={{color: 'red'}}>{error}</Text>}
                    {/*<Button title="Log in" onPress={() => {}} />*/}
                </ScrollView>
            </SafeAreaView>
    )
}

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
});