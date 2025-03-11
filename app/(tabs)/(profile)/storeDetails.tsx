import {RefreshControl, SafeAreaView} from "react-native";
import {H4, ScrollView, SizableText} from "tamagui";
import {VerticalContainer} from "@/tamagui.config";
import {useUserContext} from "@/app/(tabs)/_layout";
import axios from "@/scripts/axiosConfig";
import {useEffect, useState} from "react";

export default function StoreDetails() {
    const {store, } = useUserContext();
    const [storeId, setStoreId] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

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
                    <H4>Store ID:</H4>
                    <SizableText>{storeId}</SizableText>
                </VerticalContainer>
            </ScrollView>
        </SafeAreaView>
    )
}