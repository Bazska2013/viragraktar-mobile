import {Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, useColorScheme} from "react-native";
import {StatusBar} from "expo-status-bar";
import {useState} from "react";
import axios from "@/scripts/axiosConfig";
import {router} from "expo-router";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import Checkbox from 'expo-checkbox';
import OpeningHours from "@/app/(tabs)/(profile)/OpeningHours";
import {useUserContext} from "@/app/(tabs)/_layout";

export default function CreateStore() {

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const {getUserData, setStore} = useUserContext();

    const [error, setError] = useState(null);
    const [name, setName] = useState(null);
    const [nameInputStyle, setNameInputStyle] = useState(styles.textInput);
    const [opening_hours, setOpeningHours] = useState(null);
    const [calculation_enabled, setCalculationEnabled] = useState(true);

    const handleSubmit = async () => {
        let response;
        try {
            response = await axios.post('/api/store', {
                name: name,
                opening_hours: opening_hours,
                calculation_enabled: calculation_enabled,
            });
        } catch (error: any) {
            setError(error.response.data.message);
        } finally {
            if (response?.status === 201) {
                getUserData();
                setStore(response.data);
                router.back();
            }
        }
    }

    return (
        <SafeAreaView>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'>
                <Text style={[styles.text, {color: theme.colors.text}]}>Name of your store</Text>
                <TextInput value={name}
                           onChangeText={setName}
                           autoCapitalize='words'
                           autoFocus
                           autoCorrect={false}
                           style={[nameInputStyle, {color: theme.colors.text}]}
                           onFocus={() => setNameInputStyle({...styles.textInput, borderColor: 'blue'})}
                           onBlur={() => {
                               setNameInputStyle(styles.textInput);
                           }}
                />
                <OpeningHours setFieldValue={setOpeningHours} />
                <Text style={[styles.text, {color: theme.colors.text}]}>Enable price calculation</Text>
                <Checkbox style={styles.checkbox} value={calculation_enabled} onValueChange={setCalculationEnabled} />
                <Pressable style={styles.button} onPress={() => handleSubmit()}>
                    <Text style={[styles.text, {color: theme.colors.text}]}>Create store</Text>
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
    checkbox: {
        margin: 10,
    }
});