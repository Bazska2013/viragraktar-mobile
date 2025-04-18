import {SafeAreaView, useColorScheme} from "react-native";
import {ScrollView, Separator, SizableText, Spinner} from "tamagui";
import {BigButton, EditContainer} from "@/tamagui.config";
import OpeningHours from "@/app/(tabs)/(profile)/components/OpeningHours";
import {useUserContext} from "@/app/(tabs)/_layout";
import {useState} from "react";
import axios from "@/scripts/axiosConfig";
import {router} from "expo-router";
import {Calendar} from "@tamagui/lucide-icons";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";

export default function ChangeOpeningHours () {
    const {store, setStore} = useUserContext()
    const [openingHours, setOpeningHours] = useState(JSON.parse(store.opening_hours));

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
    const tabBarHeight = useBottomTabBarHeight();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.put('/api/store', {
                opening_hours: JSON.stringify(openingHours),
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
                    marginBottom={tabBarHeight}
                >
                    <OpeningHours openingHours={openingHours} setFieldValue={(value)=> setOpeningHours(value)} />
                    <Separator />
                    <BigButton icon={Calendar} onPress={() => handleSubmit()}>{isLoading ? <Spinner /> :'Change opening hours'}</BigButton>
                    <SizableText color="$red1">{error}</SizableText>
                </EditContainer>
            </ScrollView>
        </SafeAreaView>
    )
}