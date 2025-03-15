import {Checkbox, H4, Input, Label, ScrollView, Separator, SizableText, Spinner, Switch} from "tamagui";
import {BigButton, EditContainer, VerticalContainer} from "@/tamagui.config";
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
                <EditContainer>
                    <Label htmlFor="calculation">
                        <H4>Calculation enabled</H4>
                    </Label>
                    <Switch id="calculation" checked={calculation} onCheckedChange={() => setCalculation(!calculation)}>
                        <Switch.Thumb animation="bouncy" />
                    </Switch>
                    <Separator />
                    <BigButton icon={DollarSign} onPress={() => handleSubmit()}>{isLoading? <Spinner /> : 'Change price calculation'}</BigButton>
                    <SizableText>{error}</SizableText>
                </EditContainer>
            </ScrollView>
        </SafeAreaView>
    )
}