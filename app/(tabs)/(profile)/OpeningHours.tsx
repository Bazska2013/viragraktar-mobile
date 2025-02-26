import {useEffect, useState} from "react";
import {View, Text, StyleSheet} from "react-native";
import Checkbox from "expo-checkbox";
import DateTimePicker from '@react-native-community/datetimepicker';

const OpeningHours = ({ setFieldValue, defaultValue }: { setFieldValue: (field: string, value: any) => void, defaultValue: string }) => {

    const initializeTime = (hours: number, minutes: number) => {
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    const [openingHours, setOpeningHours] = useState({
        Mon: { from: initializeTime(8, 0), to: initializeTime(16, 0), closed: false },
        Tue: { from: initializeTime(8, 0), to: initializeTime(16, 0), closed: false },
        Wed: { from: initializeTime(8, 0), to: initializeTime(16, 0), closed: false },
        Thu: { from: initializeTime(8, 0), to: initializeTime(16, 0), closed: false },
        Fri: { from: initializeTime(8, 0), to: initializeTime(16, 0), closed: false },
        Sat: { from: initializeTime(8, 0), to: initializeTime(16, 0), closed: false },
        Sun: { from: initializeTime(8, 0), to: initializeTime(16, 0), closed: false },
    });

    useEffect(() => {
        if (defaultValue) {
            const parsedValue = JSON.parse(defaultValue);
            const updatedOpeningHours = Object.keys(parsedValue).reduce((acc, day) => {
                acc[day] = {
                    from: new Date(parsedValue[day].from),
                    to: new Date(parsedValue[day].to),
                    closed: parsedValue[day].closed
                };
                return acc;
            }, {} as typeof openingHours);
            setOpeningHours(updatedOpeningHours);
        }
    }, [defaultValue]);

    useEffect(() => {
        const stringifiedOpeningHours = JSON.stringify(openingHours, (key, value) => {
            if (value instanceof Date) {
                return value.toISOString();
            }
            return value;
        });
        setFieldValue('opening_hours', stringifiedOpeningHours);
    }, [openingHours, setFieldValue]);

    const handleSelectFrom = (day: keyof typeof openingHours, event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || openingHours[day].from;
        setOpeningHours(prev => ({
            ...prev,
            [day]: { ...prev[day], from: currentDate }
        }));
    };

    const handleSelectTo = (day: keyof typeof openingHours, event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || openingHours[day].to;
        setOpeningHours(prev => ({
            ...prev,
            [day]: { ...prev[day], to: currentDate }
        }));
    };

    const handleClick = (day: keyof typeof openingHours) => {
        setOpeningHours(prev => ({
            ...prev,
            [day]: { ...prev[day], closed: !prev[day].closed }
        }));
    };

    return (
        <View>
            {Object.keys(openingHours).map((day, index) => (
                <View key={index}>
                    <Text>{day}</Text>
                    <Text>From</Text>
                    <DateTimePicker
                        testID="dateTimePickerFrom"
                        value={openingHours[day].from}
                        mode='time'
                        is24Hour={true}
                        onChange={(event, selectedDate) => handleSelectFrom(day as keyof typeof openingHours, event, selectedDate)}
                    />
                    <Text>To</Text>
                    <DateTimePicker
                        testID="dateTimePickerTo"
                        value={openingHours[day].to}
                        mode='time'
                        is24Hour={true}
                        onChange={(event, selectedDate) => handleSelectTo(day as keyof typeof openingHours, event, selectedDate)}
                    />
                    <Text>Closed</Text>
                    <Checkbox
                        style={styles.checkbox}
                        value={openingHours[day].closed}
                        onValueChange={() => handleClick(day as keyof typeof openingHours)}
                    />
                </View>
            ))}
        </View>
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