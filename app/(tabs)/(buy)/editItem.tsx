import {useEffect, useState} from "react";
import {
    ActivityIndicator,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View
} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useSearchParams} from "expo-router/build/hooks";
import axios from '@/scripts/axiosConfig';
import {router} from "expo-router";
import {useItemsContext} from "@/app/(tabs)/(buy)/_layout";
import {StatusBar} from "expo-status-bar";
import {H2, H4, ScrollView, Label, Input, Spinner, SizableText} from "tamagui";
import {BigButton, VerticalContainer} from "@/tamagui.config";

export default function EditItem() {
    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const {fetchItems} = useItemsContext();
    const id = useSearchParams().get('id');

    const [item, setItem] = useState(null);
    const [nameInputStyle, setNameInputStyle] = useState(styles.textInput);
    const [descriptionInputStyle, setDescriptionInputStyle] = useState(styles.textInput);
    const [priceInputStyle, setPriceInputStyle] = useState(styles.textInput);
    const [stockInputStyle, setStockInputStyle] = useState(styles.textInput);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [validInput, setValidInput] = useState(true);

    const fetchItem = async () => {
        let response;
        try {
            response = await axios.get('/api/item/' + id);
        } catch (error: any) {
            setError(error.response.data.message);
        } finally {
            if (response?.status === 200) {
                setItem(response.data);
            }
        }
    }

    const handleSubmit = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/item/edit/' + id, {
                name: item.name,
                description: item.description,
                price: item.price,
                stock: item.stock,
                /*image: image*/
            });
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 200) {
                fetchItems();
                router.back();
            }
        }
    }

    useEffect(() => {
        fetchItem();
    }, []);

    useEffect(() => {
        if (item) {
            if (item.name.toString().length > 0 && item.description.toString().length > 0 && item.price.toString().length > 0 && item.stock.toString().length > 0) {
                setValidInput(true);
            } else {
                setValidInput(false);
            }
        }
    }, [item]);

    return (
        <SafeAreaView>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            {item &&
                <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'>
                    <VerticalContainer>
                        <VerticalContainer>
                            <Label htmlFor="name">
                                Name of the item
                            </Label>
                            <Input
                                flex={1}
                                // size="$3"
                                borderWidth={2}
                                id="name"
                                // isInvalid={!!errors.name}
                                value={item.name.toString()}
                                onChangeText={(value) => setItem({...item, name: value})}
                                autoFocus
                                autoCapitalize="words"
                            />
                        </VerticalContainer>
                        <VerticalContainer>
                            <Label htmlFor="description">
                                Description of the item
                            </Label>
                            <Input
                                flex={1}
                                // size="$3"
                                borderWidth={2}
                                id="description"
                                // isInvalid={!!errors.description}
                                value={item.description.toString()}
                                onChangeText={(value) => setItem({...item, description: value})}
                                autoCapitalize="sentences"
                            />
                        </VerticalContainer>
                        <VerticalContainer>
                            <Label htmlFor="price">
                                Price of the item
                            </Label>
                            <Input
                                flex={1}
                                // size="$3"
                                borderWidth={2}
                                id="price"
                                // isInvalid={!!errors.price}
                                value={item.price.toString()}
                                onChangeText={(value) => setItem({...item, price: value})}
                                keyboardType="numeric"
                            />
                        </VerticalContainer>
                        <VerticalContainer>
                            <Label htmlFor="stock">
                                Stock of the item
                            </Label>
                            <Input
                                flex={1}
                                // size="$3"
                                borderWidth={2}
                                id="stock"
                                // isInvalid={!!errors.stock}
                                value={item.stock.toString()}
                                onChangeText={(value) => setItem({...item, stock: value})}
                                keyboardType="numeric"
                            />
                        </VerticalContainer>
                        <BigButton onPress={() => {handleSubmit()}} disabled={!validInput}>{isLoading ? <Spinner /> : "Edit item"}</BigButton>
                        <SizableText>{error}</SizableText>
                    </VerticalContainer>
                </ScrollView>
            }
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
    }
});