import {H4, Input, Label, ScrollView, Separator, SizableText, Spinner, Switch} from "tamagui";
import {BigButton, EditContainer, HorizontalContainer} from "@/tamagui.config";
import {DollarSign} from "@tamagui/lucide-icons";
import {Platform, SafeAreaView, useColorScheme} from "react-native";
import {useState} from "react";
import {useUserContext} from "@/app/(tabs)/_layout";
import axios from "@/scripts/axiosConfig";
import {router} from "expo-router";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";

export default function ChangeCurrency() {

    const {setStore, sign, before} = useUserContext()

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
    const tabBarHeight = Platform.OS === "android" ? 0 : useBottomTabBarHeight();

    const [signField, setSignField] = useState(sign);
    const [beforeField, setBeforeField] = useState(before);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        let response;
        setIsLoading(true);
        let currency = {
            sign: signField,
            before: beforeField,
        }
        try {
            response = await axios.put('/api/store', {
                currency: JSON.stringify(currency),
            });
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            if (response?.status === 200) {
                setStore(response.data);
                router.back()
            }
        }
    }

    return (
        <SafeAreaView>
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'
                        automaticallyAdjustKeyboardInsets={true}>
                <EditContainer
                    backgroundColor={theme.colors.card}
                    marginBottom={tabBarHeight + 20}
                >
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
                        value={signField}
                        onChangeText={setSignField}
                    />
                    <Label htmlFor="before">
                        <H4>Appear {beforeField ? 'before' : 'after'} the price</H4>
                    </Label>
                    <HorizontalContainer>
                        <SizableText>after</SizableText>
                        <Switch size="$3" id="before" name="before" checked={beforeField} onCheckedChange={(checked) => setBeforeField(checked)}>
                            <Switch.Thumb animation="quicker" />
                        </Switch>
                        <SizableText>before</SizableText>
                    </HorizontalContainer>
                    <Separator />
                    <BigButton icon={DollarSign} onPress={handleSubmit}>{isLoading? <Spinner /> : 'Change currency'}</BigButton>
                    <SizableText color="$red1">{error}</SizableText>
                </EditContainer>
            </ScrollView>
        </SafeAreaView>
    )
}