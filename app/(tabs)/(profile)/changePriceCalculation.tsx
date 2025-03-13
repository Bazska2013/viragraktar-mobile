import {Checkbox, Input, Label, ScrollView, SizableText, Spinner} from "tamagui";
import {BigButton, VerticalContainer} from "@/tamagui.config";
import {Check, DollarSign, FilePen} from "@tamagui/lucide-icons";
import {SafeAreaView} from "react-native";
import {useState} from "react";
import {useUserContext} from "@/app/(tabs)/_layout";
import axios from "@/scripts/axiosConfig";
import {router} from "expo-router";

export default function ChangePriceCalculation() {

    const {store, setStore} = useUserContext()

    const [calculation, setCalculation] = useState(!!store?.calculation_enabled);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.put('/api/store', {
                calculation_enabled: calculation,
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
                <VerticalContainer>
                    <Label htmlFor="calculation">Calculation enabled</Label>
                    <Checkbox id="calculation" name="calculation" checked={calculation} onCheckedChange={() => setCalculation(!calculation)}>
                        <Checkbox.Indicator>
                            <Check />
                        </Checkbox.Indicator>
                    </Checkbox>
                    <BigButton icon={DollarSign} onPress={() => handleSubmit()}>{isLoading? <Spinner /> : 'Change price calculation'}</BigButton>
                    <SizableText>{error}</SizableText>
                </VerticalContainer>
            </ScrollView>
        </SafeAreaView>
    )
}