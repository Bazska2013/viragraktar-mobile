import {BigButton, HorizontalContainer, SmallButton, VerticalContainer} from "@/tamagui.config";
import {H2, Input, YStack} from "tamagui";
import {Filter, FilterX} from "@tamagui/lucide-icons";
import {useUserContext} from "@/app/(tabs)/_layout";
import React, {useCallback, useEffect, useState} from "react";
import {Dimensions, FlatList, useColorScheme} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";

const SellFilterBar = ({onTextChange, onLabelChange}) => {
    const {store} = useUserContext()
    const [labels, setLabels] = useState(JSON.parse(store.labels));
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchField, setSearchField] = useState('');
    const [selectedLabels, setSelectedLabels] = useState([]);

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    const handleChangeOpen = () => {
        if (searchOpen) {
            setSearchOpen(false);
            setSearchField('');
            setSelectedLabels([]);
        } else {
            setSearchOpen(true);
        }
    }

    const handleChangeSearch = (value) => {
        setSearchField(value);
        onTextChange(value);
    }

    const handleChangeLabel = useCallback((value: string) => {
        if (selectedLabels.includes(value)) {
            removeLabel(value);
        } else {
            addLabel(value);
        }
    }, [selectedLabels]);

    useEffect(() => {
        onLabelChange(selectedLabels);
    }, [selectedLabels]);

    useEffect(() => {
        if (searchField.length > 0) {
            const filteredLabels = labels.filter((label) => label.toLowerCase().includes(searchField.toLowerCase()));
            setLabels(filteredLabels);
        } else {
            setLabels(JSON.parse(store.labels));
        }
    }, [searchField]);

    const addLabel = (label) => {
        setSelectedLabels([...selectedLabels, label]);
    }

    const removeLabel = (label) => {
        setSelectedLabels(selectedLabels.filter((item) => item !== label));
    }

    const isInSelection = (label) => {
        return selectedLabels.includes(label);
    }

    return (
        <VerticalContainer animation="medium" width="90%" alignSelf="center">
            <HorizontalContainer alignItems="center" height={50}>
                <H2 left={0} position="absolute" animation="quicker" x={searchOpen ? -200 : 0}>Sell</H2>
                <YStack left={0} position="absolute" animation="quick" scale={searchOpen ? 1 : 0} opacity={searchOpen ? 1 : 0} width="80%">
                    <Input
                        backgroundColor={theme.colors.card}
                        type="text"
                        name="search"
                        placeholder="Search..."
                        value={searchField}
                        onChangeText={handleChangeSearch}
                    />
                </YStack>
                <BigButton size="$3" right={0} position="absolute" icon={searchOpen ? FilterX : Filter} onPress={handleChangeOpen}>{Dimensions.get('window').width > 768 ? searchOpen ? 'Remove filters' : 'Filter' : ''}</BigButton>
            </HorizontalContainer>
            <YStack animation="quick" opacity={searchOpen ? 1 : 0} height={searchOpen ? '100%' : '0%'}>
                <FlatList
                    data={labels}
                    style={{height: 50}}
                    horizontal
                    renderItem={({item}) => (<SmallButton key={item} marginLeft={5} marginRight={5} backgroundColor={isInSelection(item) ? '#FBF9EF' : '#f5f5f5'} focusStyle={{backgroundColor: '#FBF9EF'}} onPress={() => handleChangeLabel(item)}>{item}</SmallButton>)}
                />
            </YStack>
        </VerticalContainer>
    )
}

export default React.memo(SellFilterBar);