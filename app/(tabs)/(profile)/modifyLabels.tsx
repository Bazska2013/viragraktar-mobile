import {useUserContext} from "@/app/(tabs)/_layout";
import {RefreshControl, SafeAreaView, useColorScheme} from "react-native";
import {H4, Input, Paragraph, ScrollView, Separator, SizableText, Square} from "tamagui";
import {BigButton, EditContainer, HorizontalContainer, SmallButtonWithAccent} from "@/tamagui.config";
import {useEffect, useState} from "react";
import {Plus, Save, X} from "@tamagui/lucide-icons";
import axios from "@/scripts/axiosConfig";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";

export default function ModifyLabels() {
    const {store, setStore} = useUserContext();
    const [labels, setLabels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [label, setLabel] = useState('');
    const [isChanged, setIsChanged] = useState(false);

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
    const tabBarHeight = useBottomTabBarHeight();

    useEffect(() => {
        setLabels(JSON.parse(store.labels));
    }, [store]);

    const handleAddLabel = () => {
        setError(null);
        if (label.length > 0) {
            if (labels.includes(label)) {
                setError('Label already exists');
                return;
            }
            setLabels([...labels, label]);
            setLabel('');
        }
        setIsChanged(true);
    }

    const handleRemoveLabel = (label) => {
        setError(null);
        setLabels(labels.filter((l) => l !== label));
        setIsChanged(true);
    }

    const handleSubmit = async () => {
        if (isChanged) {
            let response;
            setIsLoading(true);
            try {
                response = await axios.put('/api/store', {
                    labels: JSON.stringify(labels),
                });
            } catch (error: any) {
                setIsLoading(false);
                setError(error.response.data.message);
            } finally {
                setIsLoading(false);
                if (response?.status === 200) {
                    setStore(response.data);
                    resetChanges();
                }
            }
        }
    }

    const resetChanges = () => {
        setLabels(JSON.parse(store.labels));
        setLabel('');
        setIsChanged(false);
        setError(null);
    }

    return (
        <SafeAreaView>
            <ScrollView style={{height: '100%'}}
                        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={resetChanges} />}
                        keyboardDismissMode='interactive'
                        contentInsetAdjustmentBehavior="automatic"
                        contentContainerStyle={{
                            flexGrow: 1,
                        }}
                        automaticallyAdjustKeyboardInsets={true}>
                <EditContainer
                    backgroundColor={theme.colors.card}
                    marginBottom={tabBarHeight + 20}
                >
                    <H4>Available labels</H4>
                    <Paragraph>Press the available labels listed below to remove them from your store. Items that already have the selected label will continue to have it. You have to manually remove them from the individual items.</Paragraph>
                    <HorizontalContainer flexWrap="wrap">
                        {labels && labels.map((label, index) => (
                            <Square boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)" pressStyle={{backgroundColor: '#f1f1f1', scale: 0.95}} backgroundColor="#f5f5f5" padding="$2" borderRadius="$5" key={label} onPress={() => handleRemoveLabel(label)} flexDirection="row" alignItems="center" justifyContent="space-between">
                                <SizableText color="black">{label}</SizableText>
                                <X size="$1" color="black" />
                            </Square>
                        ))}
                    </HorizontalContainer>
                    <Separator />
                    <H4>Add new label</H4>
                    <Paragraph>Type in a new label in the input field below and press the button next to it to add it to the available labels. Press the Save changes button below to save your modifications. If you wish to revert the changes made pull down the screen.</Paragraph>
                    <HorizontalContainer alignItems="center">
                        <Input
                            backgroundColor={theme.colors.card}
                            flex={1}
                            borderWidth={2}
                            name="label"
                            value={label}
                            returnKeyType="send"
                            blurOnSubmit={false}
                            onChangeText={setLabel}
                            onSubmitEditing={handleAddLabel}
                        />
                        <SmallButtonWithAccent icon={Plus} onPress={handleAddLabel} />
                    </HorizontalContainer>
                    <BigButton disabled={!isChanged} icon={Save} onPress={handleSubmit}>Save changes</BigButton>
                    {error && <SizableText color='red' >{error}</SizableText>}
                </EditContainer>
            </ScrollView>
        </SafeAreaView>
    )
}