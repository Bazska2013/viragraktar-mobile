import {RefreshControl, SafeAreaView} from "react-native";
import {H4, ScrollView, SizableText} from "tamagui";
import {SmallButtonWithAccent, VerticalContainer} from "@/tamagui.config";
import {useUserContext} from "@/app/(tabs)/_layout";
import axios from "@/scripts/axiosConfig";
import {useEffect, useState} from "react";
import * as Clipboard from 'expo-clipboard';
import {ClipboardCopy} from "@tamagui/lucide-icons";

export default function StoreDetails() {
    const {store, } = useUserContext();
    const [storeId, setStoreId] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [copied, setCopied] = useState(false);

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
        }, 30000); // 30000 milliseconds = 30 seconds

        // Cleanup interval on component unmount
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
        await Clipboard.setStringAsync('hello world');
        setCopied(true);
        const intervalId = setInterval(() => {
            setCopied(false);
        }, 2000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    };

    return (
        <SafeAreaView>
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'
                        automaticallyAdjustKeyboardInsets={true}
                        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
            >
                <VerticalContainer>
                    <H4>Store name</H4>
                    <SizableText>{store?.name}</SizableText>
                    <H4>Opening hours</H4>
                    <SizableText>{store?.opening_hours}</SizableText>
                    <H4>Is calculation enabled?</H4>
                    <SizableText>{store?.calculation_enabled ? 'Yes' : 'No'}</SizableText>
                    <H4>Press the button to copy the Store ID</H4>
                    <SmallButtonWithAccent icon={ClipboardCopy} onPress={copyToClipboard}>{copied? 'Copied!' : storeId}</SmallButtonWithAccent>
                </VerticalContainer>
            </ScrollView>
        </SafeAreaView>
    )
}