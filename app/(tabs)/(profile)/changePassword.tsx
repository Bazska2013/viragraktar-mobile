import {SafeAreaView} from "react-native";
import {Input, Label, ScrollView, SizableText, Spinner} from "tamagui";
import {BigButton, VerticalContainer} from "@/tamagui.config";
import {useEffect, useState} from "react";
import {BookKey} from "@tamagui/lucide-icons";
import axios from '@/scripts/axiosConfig';
import {router} from "expo-router";

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const [validData, setValidData] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        if (validData) {
            let response;
            setIsLoading(true);
            try {
                response = await axios.post('/api/change-password', {
                    old_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: passwordConfirmation,
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
    }

    useEffect(() => {
        if (newPassword.length > 7 && passwordConfirmation === newPassword && currentPassword.length > 7) {
            setValidData(true);
        } else {
            setValidData(false);
        }
    }, [currentPassword, newPassword, passwordConfirmation]);

    return (
        <SafeAreaView>
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'
                        automaticallyAdjustKeyboardInsets={true}>
                <VerticalContainer>
                    <VerticalContainer>
                        <Label htmlFor="current">Current password</Label>
                        <Input
                            id="current"
                            flex={1}
                            borderWidth={2}
                            placeholder="********"
                            onChangeText={setCurrentPassword}
                            value={currentPassword}
                            secureTextEntry
                            autoCapitalize="none"
                            autoFocus
                        />
                    </VerticalContainer>
                    <VerticalContainer>
                        <Label htmlFor="new">New password</Label>
                        <Input
                            id="new"
                            flex={1}
                            borderWidth={2}
                            placeholder="********"
                            onChangeText={setNewPassword}
                            value={newPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </VerticalContainer>
                    <VerticalContainer>
                        <Label htmlFor="confirm">Password confirmation</Label>
                        <Input
                            id="confirm"
                            flex={1}
                            borderWidth={2}
                            placeholder="********"
                            onChangeText={setPasswordConfirmation}
                            value={passwordConfirmation}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </VerticalContainer>
                    <BigButton disabled={!validData} icon={BookKey} onPress={() => handleSubmit()}>{isLoading ? <Spinner /> : 'Change password'}</BigButton>
                    <SizableText>{error}</SizableText>
                </VerticalContainer>
            </ScrollView>
        </SafeAreaView>
    )
}