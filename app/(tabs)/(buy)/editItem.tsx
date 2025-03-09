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
import {H2, H4, ScrollView, Label, Input, Spinner, SizableText, Sheet, Image} from "tamagui";
import {BigButton, HorizontalContainer, SmallButtonWithAccent, VerticalContainer} from "@/tamagui.config";
import * as ImagePicker from "expo-image-picker";

export default function EditItem() {
    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const {fetchItems} = useItemsContext();
    const id = useSearchParams().get('id');

    const [item, setItem] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [validInput, setValidInput] = useState(true);
    const [imageModal, setImageModal] = useState(false);

    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
        setImageModal(false);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

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
            const formDataForEdit = new FormData();
            formDataForEdit.set('name', item.name);
            formDataForEdit.set('description', item.description);
            formDataForEdit.set('price', item.price);
            formDataForEdit.set('stock', item.stock);
            if (image) {
                formDataForEdit.append('image', {
                    uri: image,
                    name: 'image.jpg',
                    type: 'image/jpeg'
                } as any);
            }
            response = await axios.post('/api/item/edit/' + id, formDataForEdit, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
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
            <Sheet
                modal={false}
                open={imageModal}
                onOpenChange={setImageModal}
                snapPoints={[20]}
                snapPointsMode='percent'
                dismissOnSnapToBottom
                position={0}
                zIndex={100_000}
                animation='medium'
            >
                <Sheet.Overlay
                    animation="lazy"
                    backgroundColor="$shadow2"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Sheet.Frame>
                    <HorizontalContainer width="100%" justifyContent="space-around">
                        <SmallButtonWithAccent onPress={pickImage}>Pick an image</SmallButtonWithAccent>
                        {/*<SmallButtonWithAccent onPress={handleOpenCamera}>Take a picture</SmallButtonWithAccent>*/}
                    </HorizontalContainer>
                </Sheet.Frame>
            </Sheet>
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
                        <VerticalContainer>
                            <SmallButtonWithAccent onPress={setImageModal}>{item.image ? 'Change image' : 'Pick an image'}</SmallButtonWithAccent>
                            {(item.image || image) && <Image alignSelf="center" borderRadius={5} source={{
                                uri: image ? image : item.image ? "http://localhost:8000/images/" + item.image : '',
                                width: 200,
                                height: 200,
                            }} />}
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