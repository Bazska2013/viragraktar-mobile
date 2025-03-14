import {
    ActivityIndicator,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme
} from "react-native";
import {StatusBar} from "expo-status-bar";
import {useEffect, useState} from "react";
import axios from "@/scripts/axiosConfig";
import {router} from "expo-router";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import OpeningHours from "@/app/(tabs)/(profile)/components/OpeningHours";
import {useUserContext} from "@/app/(tabs)/_layout";
import {BigButton, EditContainer, VerticalContainer} from "@/tamagui.config";
import {Input, Label, ScrollView, Checkbox, Spinner, SizableText} from "tamagui";
import {Check} from "@tamagui/lucide-icons";

export default function CreateStore() {

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const {getUserData, setStore} = useUserContext();

    const [error, setError] = useState(null);
    const [name, setName] = useState(null);
    const [nameInputStyle, setNameInputStyle] = useState(styles.textInput);
    const [opening_hours, setOpeningHours] = useState(null);
    const [calculation_enabled, setCalculationEnabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [validInput, setValidInput] = useState(true);

    const handleSubmit = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/store', {
                name: name,
                opening_hours: opening_hours,
                calculation_enabled: calculation_enabled,
            });
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 201) {
                getUserData();
                setStore(response.data);
                router.back();
            }
        }
    }

    useEffect(() => {
        if (name && name.length > 0 && opening_hours && opening_hours.length > 0) {
            setValidInput(true);
        } else {
            setValidInput(false);
        }
    }, [name, opening_hours]);

    return (
        <SafeAreaView>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'
                        automaticallyAdjustKeyboardInsets={true}
            >
                <EditContainer>
                    <VerticalContainer>
                        <Label htmlFor="name">Name of your store</Label>
                        <Input
                            flex={1}
                            // size="$3"
                            borderWidth={2}
                            // isInvalid={!!errors.name}
                            value={name}
                            id="name"
                            onChangeText={setName}
                            autoCapitalize='words'
                            autoFocus
                            autoCorrect={false}
                        />
                    </VerticalContainer>
                    <OpeningHours setFieldValue={setOpeningHours} />
                    <VerticalContainer>
                        <Label htmlFor="calculation_enabled">Enable price calculation</Label>
                        <Checkbox
                            id="calculation_enabled"
                            value={calculation_enabled} onValueChange={setCalculationEnabled}>
                            <Checkbox.Indicator>
                                <Check />
                            </Checkbox.Indicator>
                        </Checkbox>
                    </VerticalContainer>
                    <BigButton onPress={() => handleSubmit()} disabled={!validInput}>{isLoading ? <Spinner /> : "Create store"}</BigButton>
                </EditContainer>
                {error && <SizableText>{error}</SizableText>}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    text: {
        margin: 10,
        fontSize: 20,
    },
    textInput: {
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
    },
    button: {
        backgroundColor: 'lightblue',
        padding: 10,
        margin: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    defaultButton: {
        backgroundColor: 'lightgrey',
        padding: 10,
        margin: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    header: {
        fontSize: 25,
        padding: 10,
        fontWeight: 'bold',
    },
    checkbox: {
        margin: 10,
    }
});