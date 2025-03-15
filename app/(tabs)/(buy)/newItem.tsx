import {
    ActivityIndicator, Alert,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput, TouchableOpacity,
    useColorScheme, View
} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {router} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {useItemsContext} from "@/app/(tabs)/(buy)/_layout";
import axios from "@/scripts/axiosConfig";
import {Input, Label, ScrollView, SizableText, Spinner, Image, Sheet, H4, Separator} from "tamagui";
import {
    BigButton,
    EditContainer,
    HorizontalContainer,
    SmallButtonWithAccent,
    VerticalContainer
} from "@/tamagui.config";
import * as ImagePicker from 'expo-image-picker';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export default function NewItem() {

    const {fetchItems} = useItemsContext();

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [validInput, setValidInput] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [openCamera, setOpenCamera] = useState(false);

    const [image, setImage] = useState<string | null>(null);

    // const [facing, setFacing] = useState<CameraType>('back');
    // const [permission, requestPermission] = useCameraPermissions();

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

    // function toggleCameraFacing() {
    //     setFacing(current => (current === 'back' ? 'front' : 'back'));
    // }
    //
    // const handleOpenCamera = () => {
    //     setImageModal(false);
    //     if (!permission.granted) {
    //         Alert.alert('Grant permissions', 'You need to grant permissions to use the camera', [
    //             {
    //                 text: 'OK',
    //                 onPress: () => requestPermission()
    //             }
    //         ])
    //     } else {
    //         setOpenCamera(true);
    //     }
    // }

    const handleSubmit = async () => {
        let response;
        setIsLoading(true);
        try {
            const formDataForNew = new FormData();
            formDataForNew.set('name', name);
            formDataForNew.set('description', description);
            formDataForNew.set('price', price);
            formDataForNew.set('stock', stock);
            if (image) {
                formDataForNew.append('image', {
                    uri: image,
                    name: 'image.jpg',
                    type: 'image/jpeg'
                } as any);
            }
            response = await axios.post('/api/item', formDataForNew, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
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

    // if (openCamera) {
    //     return (<>
    //             <SmallButtonWithAccent onPress={() => setOpenCamera(false)}>Close camera</SmallButtonWithAccent>
    //             <CameraView facing={facing}>
    //                 <View>
    //                     <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
    //                         <Text style={styles.text}>Flip Camera</Text>
    //                     </TouchableOpacity>
    //                 </View>
    //             </CameraView>
    //     </>
    //     )
    // }

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
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive'>
                <EditContainer>
                    <VerticalContainer>
                        <Label htmlFor="name">
                            <H4>Name of the item</H4>
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
                    <Separator />
                    <VerticalContainer>
                        <Label htmlFor="description" >
                            <H4>Description of the item</H4>
                        </Label>
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
                    <Separator />
                    <VerticalContainer>
                        <Label htmlFor="price">
                            <H4>Price of the item</H4>
                        </Label>
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
                    <Separator />
                    <VerticalContainer>
                        <Label htmlFor="stock">
                            <H4>Stock of the item</H4>
                        </Label>
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
                    <Separator />
                    <VerticalContainer>
                        <SmallButtonWithAccent onPress={setImageModal}>Pick an image</SmallButtonWithAccent>
                        {image && <Image alignSelf="center" borderRadius={5} source={{
                            uri: image ? image : '',
                            width: 200,
                            height: 200,
                        }} />}
                    </VerticalContainer>
                    <Separator />
                    <BigButton onPress={() => {handleSubmit()}} disabled={!validInput}>{isLoading ? <Spinner /> : "New item"}</BigButton>
                    {/*<SizableText>{error}</SizableText>*/}
                </EditContainer>
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