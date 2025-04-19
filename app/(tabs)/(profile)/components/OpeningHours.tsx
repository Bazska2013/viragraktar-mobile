import React, {useCallback, useEffect, useState} from "react";
import {Dimensions} from "react-native";
import {HorizontalContainer} from "@/tamagui.config";
import Hours from "@/app/(tabs)/(profile)/components/Hours";

const OpeningHours = ({openingHours, setFieldValue}) => {

    const [openingHoursField, setOpeningHoursField] = useState(openingHours ? openingHours : {
        Mon: { from: "00:00", to: "00:00", closed: false },
        Tue: { from: "00:00", to: "00:00", closed: false },
        Wed: { from: "00:00", to: "00:00", closed: false },
        Thu: { from: "00:00", to: "00:00", closed: false },
        Fri: { from: "00:00", to: "00:00", closed: false },
        Sat: { from: "00:00", to: "00:00", closed: false },
        Sun: { from: "00:00", to: "00:00", closed: false },
    });

    useEffect(() => {
        setFieldValue(openingHoursField);
    }, [openingHoursField]);

    const handleSelectFrom = useCallback((day: string, value: string) => {
        setOpeningHoursField(prev => ({
            ...prev,
            [day]: { ...prev[day], from: value }
        }));
    }, []);

    const handleSelectTo = useCallback((day: string, value: string) => {
        setOpeningHoursField(prev => ({
            ...prev,
            [day]: { ...prev[day], to: value }
        }));
    }, []);

    const handleClick = useCallback((day: string) => {
        setOpeningHoursField(prev => ({
            ...prev,
            [day]: { ...prev[day], closed: !prev[day].closed }
        }));
    }, []);

    return (
        <HorizontalContainer flexWrap="wrap" flexDirection="column" alignSelf="center">
            {Object.keys(openingHoursField).map((day, index) => (
                <Hours
                    key={day}
                    day={day}
                    from={openingHoursField[day].from}
                    to={openingHoursField[day].to}
                    closed={openingHoursField[day].closed}
                    onSelectFrom={(value) => handleSelectFrom(day, value)}
                    onSelectTo={(value) => handleSelectTo(day, value)}
                    onClick={() => handleClick(day)}
                />
            ))}
        </HorizontalContainer>
    )
}

export default React.memo(OpeningHours);