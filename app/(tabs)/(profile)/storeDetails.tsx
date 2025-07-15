import {Platform, RefreshControl, SafeAreaView, useColorScheme} from "react-native";
import {H4, ScrollView, Separator, SizableText} from "tamagui";
import {EditContainer, SmallButtonWithAccent, VerticalContainer} from "@/tamagui.config";
import {useUserContext} from "@/app/(tabs)/_layout";
import axios from "@/scripts/axiosConfig";
import {useEffect, useState} from "react";
import * as Clipboard from 'expo-clipboard';
import {ClipboardCopy} from "@tamagui/lucide-icons";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";

export default function StoreDetails() {
    const {store, sign} = useUserContext();
    const openingHours = JSON.parse(store?.opening_hours);
    const [storeId, setStoreId] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [copied, setCopied] = useState(false);

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
    const tabBarHeight = Platform.OS === "android" ? 0 : useBottomTabBarHeight();

    const getStoreId = async () => {
        let response;
        try {
            response = await axios.get('/api/store/id');
        } catch (error) {
            console.log(error);
        } finally {
            if (response?.status === 200) {
                setStoreId(response.data);
            }
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            getStoreId();
        }, 30000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        getStoreId();
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        getStoreId().then(() => setIsRefreshing(false));
    }

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(storeId);
        setCopied(true);
        const intervalId = setInterval(() => {
            setCopied(false);
        }, 2000);

        return () => clearInterval(intervalId);
    };

    return (
        <SafeAreaView>
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'
                        automaticallyAdjustKeyboardInsets={true}
                        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
            >
                <EditContainer
                    backgroundColor={theme.colors.card}
                    marginBottom={tabBarHeight + 20}
                >
                    <H4>Store name</H4>
                    <SizableText>{store?.name}</SizableText>
                    <Separator />
                    <H4>Opening hours</H4>
                    {Object.keys(openingHours).map((day, index) => (
                        <VerticalContainer key={day}>
                            <H4>{day}</H4>
                            <SizableText>{openingHours[day].closed ? 'Closed' : 'From ' + openingHours[day].from + ' - To ' + openingHours[day].to}</SizableText>
                        </VerticalContainer>
                    ))}
                    <Separator />
                    <H4>Currency used</H4>
                    <SizableText>{sign}</SizableText>
                    <Separator />
                    <H4>Press the button to copy the Store ID</H4>
                    <SmallButtonWithAccent icon={ClipboardCopy} onPress={copyToClipboard}>{copied? 'Copied!' : storeId}</SmallButtonWithAccent>
                </EditContainer>
            </ScrollView>
        </SafeAreaView>
    )
}