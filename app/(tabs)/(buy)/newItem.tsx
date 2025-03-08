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
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {router} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {useItemsContext} from "@/app/(tabs)/(buy)/_layout";
import axios from "@/scripts/axiosConfig";
import {Input, Label, ScrollView, SizableText, Spinner} from "tamagui";
import {BigButton, VerticalContainer} from "@/tamagui.config";

export default function NewItem() {

    const {fetchItems} = useItemsContext();

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const [name, setName] = useState('');
    const [nameInputStyle, setNameInputStyle] = useState(styles.textInput);
    const [description, setDescription] = useState('');
    const [descriptionInputStyle, setDescriptionInputStyle] = useState(styles.textInput);
    const [price, setPrice] = useState('');
    const [priceInputStyle, setPriceInputStyle] = useState(styles.textInput);
    const [stock, setStock] = useState('');
    const [stockInputStyle, setStockInputStyle] = useState(styles.textInput);
    const [isLoading, setIsLoading] = useState(false);
    const [validInput, setValidInput] = useState(false);

    const handleSubmit = async () => {
        let response;
        setIsLoading(true);
        try {
            response = await axios.post('/api/item', {
                name: name,
                description: description,
                price: price,
                stock: stock,
                /*image: values.image*/
            });
        } catch (error: any) {
            setIsLoading(false);
            console.log(error.response.data.message);
        } finally {
            setIsLoading(false);
            if (response?.status === 201) {
                fetchItems();
                router.back();
            }
        }
    }

    useEffect(() => {
        if (name.length > 0 && description.length > 0 && price.length > 0 && stock.length > 0) {
            setValidInput(true);
        } else {
            setValidInput(false);
        }
    }, [name, description, price, stock]);

    return (
        <SafeAreaView>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'>
                <VerticalContainer>
                    <VerticalContainer>
                        <Label htmlFor="name">
                            Name of the item
                        </Label>
                        <Input
                            id="name"
                            flex={1}
                            // size="$3"
                            borderWidth={2}
                            // isInvalid={!!errors.name}
                            value={name}
                            onChangeText={setName}
                            autoFocus
                            autoCapitalize="words"
                        />
                    </VerticalContainer>
                    <VerticalContainer>
                        <Label htmlFor="description" >Description of the item</Label>
                        <Input
                            flex={1}
                            // size="$3"
                            borderWidth={2}
                            id="description"
                            // isInvalid={!!errors.description}
                            value={description}
                            onChangeText={setDescription}
                            autoCapitalize="sentences"
                        />
                    </VerticalContainer>
                    <VerticalContainer>
                        <Label htmlFor="price">Price of the item</Label>
                        <Input
                            flex={1}
                            // size="$3"
                            borderWidth={2}
                            id="price"
                            // isInvalid={!!errors.price}
                            value={price}
                            onChangeText={setPrice}
                            keyboardType="numeric"
                        />
                    </VerticalContainer>
                    <VerticalContainer>
                        <Label htmlFor="stock">Stock of the item</Label>
                        <Input
                            flex={1}
                            // size="$3"
                            borderWidth={2}
                            id="stock"
                            // isInvalid={!!errors.stock}
                            value={stock}
                            onChangeText={setStock}
                            keyboardType="numeric"
                        />
                    </VerticalContainer>
                    <BigButton onPress={() => {handleSubmit()}} disabled={!validInput}>{isLoading ? <Spinner /> : "New item"}</BigButton>
                    {/*<SizableText>{error}</SizableText>*/}
                </VerticalContainer>
            </ScrollView>
        </SafeAreaView>
    )
};

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