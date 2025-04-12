import {Platform, SafeAreaView, useColorScheme} from "react-native";
import {StatusBar} from "expo-status-bar";
import {useEffect, useState} from "react";
import axios from "@/scripts/axiosConfig";
import {router} from "expo-router";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import OpeningHours from "@/app/(tabs)/(profile)/components/OpeningHours";
import {useUserContext} from "@/app/(tabs)/_layout";
import {BigButton, EditContainer, HorizontalContainer, VerticalContainer} from "@/tamagui.config";
import {Input, Label, ScrollView, Spinner, SizableText, H4, Separator, Switch} from "tamagui";

export default function CreateStore() {

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const {getUserData, setStore, fetchUserData} = useUserContext();

    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [opening_hours, setOpeningHours] = useState(null);
    const [sign, setSign] = useState('');
    const [before, setBefore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [validInput, setValidInput] = useState(true);

    const handleSubmit = async () => {
        let response;
        setIsLoading(true);
        let currency = {
            sign: sign,
            before: before,
        }
        try {
            response = await axios.post('/api/store', {
                name: name,
                opening_hours: JSON.stringify(opening_hours),
                currency: JSON.stringify(currency),
            });
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 201) {
                fetchUserData();
                getUserData();
                setStore(response.data);
                router.back();
            }
        }
    }

    useEffect(() => {
        if (name && name.length > 0) {
            setValidInput(true);
        } else {
            setValidInput(false);
        }
    }, [name, opening_hours]);

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
                        <Label htmlFor="name">
                            <H4>Name of your store</H4>
                        </Label>
                        <Input
                            backgroundColor={theme.colors.card}
                            flex={1}
                            borderWidth={2}
                            value={name}
                            id="name"
                            onChangeText={setName}
                            autoCapitalize='words'
                            autoFocus
                            autoCorrect={false}
                        />
                    </VerticalContainer>
                    <Separator />
                    <OpeningHours setFieldValue={setOpeningHours} />
                    <Separator />
                    <VerticalContainer>
                        <Label htmlFor="sign">
                            <H4>Set the currency sign used in this store</H4>
                        </Label>
                        <Input
                            backgroundColor={theme.colors.card}
                            flex={1}
                            borderWidth={2}
                            type="text"
                            name="sign"
                            id="sign"
                            value={sign}
                            onChangeText={setSign}
                        />
                        <Label htmlFor="before">
                            <H4>Appear {before ? 'before' : 'after'} the price</H4>
                        </Label>
                        <HorizontalContainer>
                            <SizableText>after</SizableText>
                            <Switch size="$3" id="before" name="before" checked={before} onCheckedChange={(checked) => setBefore(checked)}>
                                <Switch.Thumb animation="quicker" />
                            </Switch>
                            <SizableText>before</SizableText>
                        </HorizontalContainer>
                    </VerticalContainer>
                    <Separator />
                    <BigButton onPress={() => handleSubmit()} disabled={!validInput}>{isLoading ? <Spinner /> : "Create store"}</BigButton>
                </EditContainer>
                {error && <SizableText color="$red1">{error}</SizableText>}
            </ScrollView>
        </SafeAreaView>
    )
}