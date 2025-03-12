import {SafeAreaView} from "react-native";
import {ScrollView, SizableText, Spinner} from "tamagui";
import {BigButton, VerticalContainer} from "@/tamagui.config";
import OpeningHours from "@/app/(tabs)/(profile)/OpeningHours";
import {useUserContext} from "@/app/(tabs)/_layout";
import {useEffect, useState} from "react";
import axios from "@/scripts/axiosConfig";
import {router} from "expo-router";
import {Calendar} from "@tamagui/lucide-icons";

export default function ChangeOpeningHours () {
    const {store} = useUserContext()
    const [openingHours, setOpeningHours] = useState(JSON.parse(store.opening_hours));

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
                router.back()
            }
        }
    }

    return (
        <SafeAreaView>
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'
                        automaticallyAdjustKeyboardInsets={true}>
                <VerticalContainer>
                    <OpeningHours openingHours={openingHours} setFieldValue={(value)=> setOpeningHours(value)} />
                    <BigButton icon={Calendar} onPress={() => handleSubmit()}>{isLoading ? <Spinner /> :'Change opening hours'}</BigButton>
                    <SizableText>{error}</SizableText>
                </VerticalContainer>
            </ScrollView>
        </SafeAreaView>
    )
}