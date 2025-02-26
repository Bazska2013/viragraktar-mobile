import {Platform, SafeAreaView, ScrollView, useColorScheme, Text, Pressable, StyleSheet, TextInput} from "react-native";
import {StatusBar} from "expo-status-bar";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useState} from "react";
import axios from "@/scripts/axiosConfig";
import {router} from "expo-router";
import {useUserContext} from "@/app/(tabs)/_layout";

export default function JoinStore() {

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
    const {getUserData, setStore} = useUserContext();

    const [error, setError] = useState(null);
    const [code, setCode] = useState(null);
    const [codeInputStyle, setCodeInputStyle] = useState(styles.textInput);

    const handleSubmit = async () => {
        let response;
        try {
            response = await axios.post('/api/join', {
                unique_id: code,
            });
        } catch (error: any) {
            setError(error.response.data.message);
        } finally {
            if (response?.status === 200) {
                getUserData();
                setStore(response.data);
                router.back();
            }
        }
    }

    return (
        <SafeAreaView>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            <ScrollView>
                <Text style={[styles.header, {color: theme.colors.text}]}>Enter the unique ID of the Store you want to join</Text>
                <TextInput value={code}
                           onChangeText={setCode}
                           autoCapitalize='characters'
                           autoFocus
                           style={[codeInputStyle, {color: theme.colors.text}]}
                           onFocus={() => setCodeInputStyle({...styles.textInput, borderColor: 'blue'})}
                           onBlur={() => {
                               setCodeInputStyle(styles.textInput);
                           }}
                />
                <Pressable style={styles.button} onPress={() => handleSubmit()}>
                    <Text style={[styles.text, {color: theme.colors.text}]}>Join Store</Text>
                </Pressable>
                {error && <Text style={[styles.text, {color: 'red'}]}>{error}</Text>}
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
    header: {
        fontSize: 25,
        padding: 10,
        fontWeight: 'bold',
    },
});