import {useUserContext} from "@/app/(tabs)/_layout";
import {useState} from "react";
import axios from "@/scripts/axiosConfig";
import {router} from "expo-router";
import {SafeAreaView} from "react-native";
import {H4, Input, Label, ScrollView, Separator, SizableText, Spinner} from "tamagui";
import {BigButton, EditContainer} from "@/tamagui.config";
import {FilePen} from "@tamagui/lucide-icons";

export default function ChangeStoreName() {
    const {store, setStore} = useUserContext()

    const [name, setName] = useState(store?.name)

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.put('/api/store', {
                name: name
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
                    <Label htmlFor="name">
                        <H4>Store name</H4>
                    </Label>
                    <Input
                        id="name"
                        flex={1}
                        borderWidth={2}
                        onChangeText={setName}
                        value={name}
                        autoCapitalize="words"
                        autoFocus
                    />
                    <Separator />
                    <BigButton icon={FilePen} onPress={() => handleSubmit()}>{isLoading? <Spinner /> : 'Change store name'}</BigButton>
                    <SizableText color="$red1">{error}</SizableText>
                </EditContainer>
            </ScrollView>
        </SafeAreaView>
    )
}