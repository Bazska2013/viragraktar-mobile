import {SafeAreaView} from "react-native";
import {ScrollView} from "tamagui";
import {BigButton, VerticalContainer} from "@/tamagui.config";
import OpeningHours from "@/app/(tabs)/(profile)/OpeningHours";
import {useUserContext} from "@/app/(tabs)/_layout";
import {useState} from "react";

export default function ChangeOpeningHours () {
    const {store} = useUserContext()
    const [openingHours, setOpeningHours] = useState(store?.opening_hours)

    return (
        <SafeAreaView>
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'
                        automaticallyAdjustKeyboardInsets={true}>
                <VerticalContainer>
                    <OpeningHours setFieldValue={setOpeningHours} defaultValue={openingHours} />
                    <BigButton>Change opening hours</BigButton>
                </VerticalContainer>
            </ScrollView>
        </SafeAreaView>
    )
}