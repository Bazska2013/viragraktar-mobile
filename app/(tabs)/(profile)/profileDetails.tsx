import {SafeAreaView, useColorScheme} from "react-native";
import {H4, ScrollView, Separator, SizableText} from "tamagui";
import {EditContainer, HorizontalContainer, VerticalContainer} from "@/tamagui.config";
import {useUserContext} from "@/app/(tabs)/_layout";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";

export default function ProfileDetails() {
    const {user, store} = useUserContext();

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    return (
        <SafeAreaView>
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'
                        automaticallyAdjustKeyboardInsets={true}>
                <EditContainer
                    backgroundColor={theme.colors.card}
                >
                    <HorizontalContainer
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <H4>Username</H4>
                        <SizableText>{user?.name}</SizableText>
                    </HorizontalContainer>
                    <Separator />
                    <HorizontalContainer
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <H4>Email</H4>
                        <SizableText>{user?.email}</SizableText>
                    </HorizontalContainer>
                    {store && <>
                        <Separator />
                        <VerticalContainer>
                            <H4>Privileges</H4>
                            <SizableText>{user?.is_admin && 'Admin'}</SizableText>
                            <SizableText>{user?.is_buyer && 'Buyer'}</SizableText>
                            <SizableText>{user?.is_seller && 'Seller'}</SizableText>
                        </VerticalContainer>
                    </>
                    }
                    <SizableText alignSelf="center">Register date: {user.created_at.slice(0,10)}</SizableText>
                </EditContainer>
            </ScrollView>
        </SafeAreaView>
    )
}