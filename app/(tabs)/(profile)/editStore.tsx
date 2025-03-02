import {
    Platform,
    SafeAreaView,
    ScrollView,
    useColorScheme,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ActivityIndicator
} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {StatusBar} from "expo-status-bar";
import OpeningHours from "@/app/(tabs)/(profile)/OpeningHours";
import Checkbox from "expo-checkbox";
import {useEffect, useState} from "react";
import {useUserContext} from "@/app/(tabs)/_layout";
import axios from "@/scripts/axiosConfig";
import {router} from "expo-router";

export default function EditStore() {
    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const {getUserData, setStore, store} = useUserContext();

    const [error, setError] = useState(null);
    const [name, setName] = useState(store.name);
    const [nameInputStyle, setNameInputStyle] = useState(styles.textInput);
    const [opening_hours, setOpeningHours] = useState(store.opening_hours);
    const [calculation_enabled, setCalculationEnabled] = useState(store.calculation_enabled);
    const [isLoading, setIsLoading] = useState(false);
    const [validInput, setValidInput] = useState(true);

    const handleSubmit = async () => {
        setIsLoading(true);
        let response;
        try {
            response = await axios.put('/api/store', {
                name: name,
                opening_hours: opening_hours,
                calculation_enabled: calculation_enabled,
            });
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                getUserData();
                setStore(response.data);
                router.back();
            }
        }
    }

    useEffect(() => {
        if (name.length > 0 /*&& opening_hours && opening_hours.length > 0*/) {
            setValidInput(true);
        } else {
            setValidInput(false);
        }
    }, []);

    return (
        <SafeAreaView>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'>
                <Text>Name of your store</Text>
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
                {/*<OpeningHours setFieldValue={setOpeningHours} defaultValue={store.opening_hours} />*/}
                <Text style={[styles.text, {color: theme.colors.text}]}>Enable price calculation</Text>
                <Checkbox style={styles.checkbox} value={calculation_enabled} onValueChange={setCalculationEnabled} />
                {isLoading ? <>
                    <ActivityIndicator size='large' />
                </> : <>
                    <Pressable style={validInput ? styles.button : styles.defaultButton} onPress={() => handleSubmit()} disabled={!validInput}>
                        <Text style={[styles.text, {color: theme.colors.text}]}>Edit store</Text>
                    </Pressable>
                </>}
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
    defaultButton: {
        backgroundColor: 'lightgrey',
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