import {SafeAreaView, ScrollView, StyleSheet, useColorScheme, Text, TextInput, Pressable, Platform} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useState} from "react";
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

    const handleRegister = async () => {
        let response;
        try {
            response = await axios.post('/api/register', {
                email: email,
                name: name,
                password: password,
                password_confirmation: passwordConfirm,
            });
        } catch (error: any) {
            setError(error.response?.data?.message);
        } finally {
            router.back();
        }
    }

    return (
        <SafeAreaView>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
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
                           style={[passwordConfirmInputStyle, {color: theme.colors.text}]}
                           autoCapitalize="none"
                           onFocus={() => setPasswordConfirmInputStyle({...styles.textInput, borderColor: 'blue'})}
                           onBlur={() => {
                               setPasswordConfirmInputStyle(styles.textInput);
                           }}
                />
                <Pressable style={styles.button} onPress={() => {handleRegister()}}>
                    <Text>Sign up</Text>
                </Pressable>
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
});