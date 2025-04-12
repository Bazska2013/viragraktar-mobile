import React, {useEffect, useState} from "react";
import {useUserContext} from "@/app/(tabs)/_layout";
import {HorizontalContainer, SmallButton, SmallButtonWithAccent, VerticalContainer} from "@/tamagui.config";
import {H6, Input, Separator} from "tamagui";
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

    const handleAddToSelected = (label) => {
        if (!selectedLabels.includes(label)) {
            setSelectedLabels([...selectedLabels, label]);
            setLabels(labels.filter((l) => l !== label));
        }
    }

    const handleRemoveFromSelected = (label) => {
        if (selectedLabels.includes(label)) {
            setSelectedLabels(selectedLabels.filter((l) => l !== label));
            setLabels([...labels, label]);
        }
    }

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
                    <SmallButton iconAfter={Plus} onPress={() => handleAddToSelected(label)} borderWidth={1} padding="$2" borderRadius="$5" key={label}>{label}</SmallButton>
                ))}
            </HorizontalContainer>
            <Separator />
            <H6>Selected labels</H6>
            <HorizontalContainer flexWrap="wrap">
                {selectedLabels && selectedLabels.map((label, index) => (
                    <SmallButtonWithAccent iconAfter={X} onPress={() => handleRemoveFromSelected(label)} borderWidth={1} padding="$2" borderRadius="$5" key={label}>{label}</SmallButtonWithAccent>
                ))}
            </HorizontalContainer>
        </VerticalContainer>
    )
}

export default React.memo(Labels);