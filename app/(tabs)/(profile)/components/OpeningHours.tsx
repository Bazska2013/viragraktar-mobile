import {useEffect, useState} from "react";
import {Dimensions} from "react-native";
import {HorizontalContainer} from "@/tamagui.config";
import Hours from "@/app/(tabs)/(profile)/components/Hours";

const OpeningHours = (props) => {

    const [openingHours, setOpeningHours] = useState(props.openingHours ? props.openingHours : {
        Mon: { from: "00:00", to: "00:00", closed: false },
        Tue: { from: "00:00", to: "00:00", closed: false },
        Wed: { from: "00:00", to: "00:00", closed: false },
        Thu: { from: "00:00", to: "00:00", closed: false },
        Fri: { from: "00:00", to: "00:00", closed: false },
        Sat: { from: "00:00", to: "00:00", closed: false },
        Sun: { from: "00:00", to: "00:00", closed: false },
    });

    useEffect(() => {
        props.setFieldValue(openingHours);
    }, [openingHours]);

    const handleSelectFrom = (day: string, value: string) => {
        setOpeningHours(prev => ({
            ...prev,
            [day]: { ...prev[day], from: value }
        }));
    };

    const handleSelectTo = (day: string, value: string) => {
        setOpeningHours(prev => ({
            ...prev,
            [day]: { ...prev[day], to: value }
        }));
    };

    const handleClick = (day: string) => {
        setOpeningHours(prev => ({
            ...prev,
            [day]: { ...prev[day], closed: !prev[day].closed }
        }));
    };

    return (
        <HorizontalContainer flexWrap="wrap" flexDirection={Dimensions.get('window').width >= 768 ? 'row' : 'column'} width="90%" alignSelf="center">
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