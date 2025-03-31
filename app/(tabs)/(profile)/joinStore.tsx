import {Platform, SafeAreaView, useColorScheme} from "react-native";
import {StatusBar} from "expo-status-bar";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useEffect, useState} from "react";
import axios from "@/scripts/axiosConfig";
import {router} from "expo-router";
import {useUserContext} from "@/app/(tabs)/_layout";
import {H4, Input, ScrollView, Separator, SizableText, Spinner} from "tamagui";
import {BigButton, EditContainer} from "@/tamagui.config";

export default function JoinStore() {

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
    const {getUserData, setStore} = useUserContext();

    const [error, setError] = useState(null);
    const [code, setCode] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [validInput, setValidInput] = useState(false);

    const handleSubmit = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/join', {
                unique_id: code,
            });
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response.data.error);
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
        if (code && code.length === 6) {
            setValidInput(true);
        } else {
            setValidInput(false);
        }
    }, [code]);

    return (
        <SafeAreaView>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'
                        automaticallyAdjustKeyboardInsets={true}
            >
                <EditContainer>
                    <H4>Enter the unique ID of the Store you want to join</H4>
                    <Input
                        flex={1}
                        borderWidth={2}
                        value={code ? code.toString() : ''}
                        onChangeText={setCode}
                        autoCapitalize='characters'
                        autoFocus
                    />
                    <Separator />
                    <BigButton onPress={() => handleSubmit()} disabled={!validInput}>{isLoading ? <Spinner /> : "Join store"}</BigButton>
                    {error && <SizableText color="$red1">{error}</SizableText>}
                </EditContainer>
            </ScrollView>
        </SafeAreaView>
    )
}