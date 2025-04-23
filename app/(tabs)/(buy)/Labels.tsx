import React, {useEffect, useState, useCallback} from "react";
import {useUserContext} from "@/app/(tabs)/_layout";
import {HorizontalContainer, SmallButton, SmallButtonWithAccent, VerticalContainer} from "@/tamagui.config";
import {H6, Input, Separator, SizableText, Square} from "tamagui";
import {Plus, X} from "@tamagui/lucide-icons";
import {useColorScheme} from "react-native";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";

const Labels = ({value, id, onChange, combined}) => {
    const {store} = useUserContext();

    const [labels, setLabels] = useState([]);
    const [selectedLabels, setSelectedLabels] = useState(value);
    const [searchField, setSearchField] = useState('');
    const [filteredLabels, setFilteredLabels] = useState([]);

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

    useEffect(() => {
        if (combined) {
            setSelectedLabels(value)
        }
    }, [value]);

    const handleAddToSelected = useCallback((label) => {
        if (!selectedLabels.includes(label)) {
            setSelectedLabels([...selectedLabels, label]);
            setLabels(labels.filter((l) => l !== label));
        }
    }, [selectedLabels, labels]);

    const handleRemoveFromSelected = useCallback((label) => {
        if (selectedLabels.includes(label)) {
            setSelectedLabels(selectedLabels.filter((l) => l !== label));
            setLabels([...labels, label]);
        }
    }, [selectedLabels, labels]);

    useEffect(() => {
        if (searchField.length > 0) {
            setFilteredLabels(labels.filter((label) => label.toLowerCase().includes(searchField.toLowerCase())));
        } else {
            setFilteredLabels(labels);
        }
    }, [searchField]);

    useEffect(() => {
        if (value !== selectedLabels) {
            onChange(selectedLabels);
        }
    }, [selectedLabels]);

    useEffect(() => {
        if (store) {
            setLabels(JSON.parse(store.labels));
            setFilteredLabels(JSON.parse(store.labels));
        }
    }, [store]);

    return (
        <VerticalContainer>
            <H6>Filter available labels</H6>
            <Input
                backgroundColor={theme.colors.card}
                type="text"
                value={searchField}
                onChangeText={setSearchField}
            />
            <Separator />
            <H6>Available labels</H6>
            <HorizontalContainer flexWrap="wrap">
                {filteredLabels.map((label, index) => (
                    <Square boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)" pressStyle={{backgroundColor: '#f1f1f1', scale: 0.95}} backgroundColor="#f5f5f5" onPress={() => handleAddToSelected(label)} borderWidth={1} padding="$2" borderRadius="$5" key={label} flexDirection="row" alignItems="center" justifyContent="space-between">
                        <SizableText color="black">{label}</SizableText>
                        <Plus color="black" size="$1" />
                    </Square>
                ))}
            </HorizontalContainer>
            <Separator />
            <H6>Selected labels</H6>
            <HorizontalContainer flexWrap="wrap">
                {selectedLabels && selectedLabels.map((label, index) => (
                    <Square boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)" pressStyle={{backgroundColor: '#f5ebe1', scale: 0.95}} backgroundColor="#FBF9EF" onPress={() => handleRemoveFromSelected(label)} borderWidth={1} padding="$2" borderRadius="$5" key={label} flexDirection="row" alignItems="center" justifyContent="space-between">
                        <SizableText color="black">{label}</SizableText>
                        <X size="$1" color="black" />
                    </Square>
                ))}
            </HorizontalContainer>
        </VerticalContainer>
    )
}

export default React.memo(Labels);