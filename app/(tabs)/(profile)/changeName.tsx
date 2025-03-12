import {SafeAreaView} from "react-native";
import {Input, Label, ScrollView, SizableText, Spinner} from "tamagui";
import {VerticalContainer, BigButton} from "@/tamagui.config";
import {useState} from "react";
import {useUserContext} from "@/app/(tabs)/_layout";
import axios from "@/scripts/axiosConfig";
import {router} from "expo-router";
import {UserPen} from "@tamagui/lucide-icons";

export default function ChangeName() {
    const {user, getUserData} = useUserContext();

    const [name, setName] = useState(user?.name);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/change-name', {
                name: name
            });
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                router.back();
            }
        }
    }

    return (
        <SafeAreaView>
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'
                        automaticallyAdjustKeyboardInsets={true}>
                <VerticalContainer>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        flex={1}
                        borderWidth={2}
                        id="name"
                        value={name}
                        onChangeText={setName}
                        autoFocus
                        autoCapitalize="words"
                    />
                    <SizableText>Changes appear only after you log in again</SizableText>
                    <BigButton icon={UserPen} onPress={() => handleSubmit()}>{isLoading ? <Spinner /> : 'Change name'}</BigButton>
                    <SizableText>{error}</SizableText>
                </VerticalContainer>
            </ScrollView>
        </SafeAreaView>
    )
}