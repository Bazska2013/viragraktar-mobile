import {SafeAreaView, useColorScheme} from "react-native";
import {H4, Input, Label, ScrollView, Separator, SizableText, Spinner} from "tamagui";
import {BigButton, EditContainer, VerticalContainer} from "@/tamagui.config";
import {useEffect, useRef, useState} from "react";
import {BookKey} from "@tamagui/lucide-icons";
import axios from '@/scripts/axiosConfig';
import {router} from "expo-router";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
    const tabBarHeight = useBottomTabBarHeight();

    const [validData, setValidData] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const newPasswordRef = useRef(null);
    const passwordConfirmationRef = useRef(null);

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
                <EditContainer
                    backgroundColor={theme.colors.card}
                    marginBottom={tabBarHeight}
                >
                    <VerticalContainer>
                        <Label htmlFor="current">
                            <H4>Current password</H4>
                        </Label>
                        <Input
                            backgroundColor={theme.colors.card}
                            id="current"
                            flex={1}
                            borderWidth={2}
                            placeholder="********"
                            onChangeText={setCurrentPassword}
                            value={currentPassword}
                            secureTextEntry
                            autoCapitalize="none"
                            autoFocus
                            returnKeyType="next"
                            onSubmitEditing={() => newPasswordRef.current?.focus()}
                        />
                    </VerticalContainer>
                    <Separator />
                    <VerticalContainer>
                        <Label htmlFor="new">
                            <H4>New password</H4>
                        </Label>
                        <Input
                            ref={newPasswordRef}
                            backgroundColor={theme.colors.card}
                            id="new"
                            flex={1}
                            borderWidth={2}
                            placeholder="********"
                            onChangeText={setNewPassword}
                            value={newPassword}
                            secureTextEntry
                            autoCapitalize="none"
                            returnKeyType="next"
                            onSubmitEditing={() => passwordConfirmationRef.current?.focus()}
                        />
                    </VerticalContainer>
                    <Separator />
                    <VerticalContainer>
                        <Label htmlFor="confirm">
                            <H4>Password confirmation</H4>
                        </Label>
                        <Input
                            ref={passwordConfirmationRef}
                            backgroundColor={theme.colors.card}
                            id="confirm"
                            flex={1}
                            borderWidth={2}
                            placeholder="********"
                            onChangeText={setPasswordConfirmation}
                            value={passwordConfirmation}
                            secureTextEntry
                            autoCapitalize="none"
                            returnKeyType="send"
                            onSubmitEditing={handleSubmit}
                        />
                    </VerticalContainer>
                    <Separator />
                    <BigButton disabled={!validData} icon={BookKey} onPress={() => handleSubmit()}>{isLoading ? <Spinner /> : 'Change password'}</BigButton>
                    <SizableText color="$red1">{error}</SizableText>
                </EditContainer>
            </ScrollView>
        </SafeAreaView>
    )
}