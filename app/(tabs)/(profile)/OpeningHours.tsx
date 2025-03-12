import {useEffect, useState} from "react";
import {View, Text, StyleSheet} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import {HorizontalContainer, VerticalContainer} from "@/tamagui.config";
import {H4, Label, Checkbox} from "tamagui";
import {Check} from "@tamagui/lucide-icons";
import Hours from "@/app/(tabs)/(profile)/Hours";

const OpeningHours = ({ setFieldValue, defaultValue }: { setFieldValue: (field: string, value: any) => void, defaultValue: string }) => {

    const [openingHours, setOpeningHours] = useState({
        Mon: { from: "00:00", to: "00:00", closed: false },
        Tue: { from: "00:00", to: "00:00", closed: false },
        Wed: { from: "00:00", to: "00:00", closed: false },
        Thu: { from: "00:00", to: "00:00", closed: false },
        Fri: { from: "00:00", to: "00:00", closed: false },
        Sat: { from: "00:00", to: "00:00", closed: false },
        Sun: { from: "00:00", to: "00:00", closed: false },
    });

    useEffect(() => {
        setFieldValue('opening_hours', JSON.stringify(openingHours));
    }, [openingHours, setFieldValue]);

    const handleSelectFrom = (day, value) => {
        setOpeningHours(prev => ({
            ...prev,
            [day]: { ...prev[day], from: value }
        }));
    };

    const handleSelectTo = (day, value) => {
        setOpeningHours(prev => ({
            ...prev,
            [day]: { ...prev[day], to: value }
        }));
    };

    const handleClick = (day) => {
        setOpeningHours(prev => ({
            ...prev,
            [day]: { ...prev[day], closed: !prev[day].closed }
        }));
    };

    return (
        <HorizontalContainer flexWrap="wrap">
            {Object.keys(openingHours).map((day, index) => (
                <Hours
                    key={index}
                    day={day}
                    from={openingHours[day].from}
                    to={openingHours[day].to}
                    closed={openingHours[day].closed}
                    onSelectFrom={(value) => handleSelectFrom(day, value)}
                    onSelectTo={(value) => handleSelectTo(day, value)}
                    onClick={() => handleClick(day)}
                />
            ))}
        </HorizontalContainer>
    )
}

export default OpeningHours;

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
    header: {
        fontSize: 25,
        padding: 10,
        fontWeight: 'bold',
    },
    checkbox: {
        margin: 10,
    }
});