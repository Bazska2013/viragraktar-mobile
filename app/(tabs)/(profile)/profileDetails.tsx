import {SafeAreaView} from "react-native";
import {H4, ScrollView, SizableText} from "tamagui";
import {VerticalContainer} from "@/tamagui.config";
import {useUserContext} from "@/app/(tabs)/_layout";

export default function ProfileDetails() {
    const {user} = useUserContext();

    return (
        <SafeAreaView>
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'
                        automaticallyAdjustKeyboardInsets={true}>
                <VerticalContainer>
                    <H4>Username</H4>
                    <SizableText>{user?.name}</SizableText>
                    <H4>Email</H4>
                    <SizableText>{user?.email}</SizableText>
                    <H4>Privileges</H4>
                    <SizableText>{user?.is_admin && 'Admin'}</SizableText>
                    <SizableText>{user?.is_buyer && 'Buyer'}</SizableText>
                    <SizableText>{user?.is_seller && 'Seller'}</SizableText>
                </VerticalContainer>
            </ScrollView>
        </SafeAreaView>
    )
}