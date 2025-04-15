import {HorizontalContainer, SmallButtonWithAccent, StyledGroup, VerticalContainer} from "@/tamagui.config";
import {Checkbox, Group, H4, H6, Label, Separator} from "tamagui";
import RNDateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import React, {useState} from "react";
import {Check} from "@tamagui/lucide-icons";
import {Platform} from "react-native";

const Hours = ({from, to, onSelectFrom, onSelectTo, day, closed, onClick}) => {
    const [fromDate, setFromDate] = useState(() => {
        const [hours, minutes] = (from || "00:00").split(':').map(Number);
        return new Date(1970, 0, 1, hours, minutes);
    });
    const [toDate, setToDate] = useState(() => {
        const [hours, minutes] = (to || "00:00").split(':').map(Number);
        return new Date(1970, 0, 1, hours, minutes);
    });

    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);

    const handleFrom = (event: DateTimePickerEvent, date: Date) => {
        const {
            type,
            nativeEvent: {timestamp, utcOffset},
        } = event;
        if (type === 'dismissed') {
            setShowFromPicker(false);
            return;
        }
        setFromDate(new Date(date));
        onSelectFrom(date.getHours() + ':' + date.getMinutes());
        setShowFromPicker(false);
    }

    const handleTo = (event: DateTimePickerEvent, date: Date) => {
        const {
            type,
            nativeEvent: {timestamp, utcOffset},
        } = event;
        if (type === 'dismissed') {
            setShowToPicker(false);
            return;
        }
        setToDate(new Date(date));
        onSelectTo(date.getHours() + ':' + date.getMinutes());
        setShowToPicker(false);
    }

    return (
        <VerticalContainer width="100%">
            <H4>
                {day}
            </H4>

            <Group orientation="horizontal" width="100%" justifyContent="space-between">
                {Platform.OS === 'android' ? <>
                    <Group.Item>
                        <H6>From</H6>
                        <SmallButtonWithAccent onPress={setShowFromPicker}>{from}</SmallButtonWithAccent>
                        {showFromPicker &&
                            <RNDateTimePicker is24Hour display="clock" style={{width: '100%'}} alignSelf="center" value={fromDate} onChange={handleFrom} mode="time" />
                        }
                    </Group.Item>
                    <Group.Item>
                        <H6>to</H6>
                        <SmallButtonWithAccent onPress={setShowToPicker}>{to}</SmallButtonWithAccent>
                        {showToPicker &&
                            <RNDateTimePicker is24Hour display="clock" alignSelf="center" value={toDate} onChange={handleTo} mode="time" />
                        }
                    </Group.Item>
                </> : <>
                    <Group.Item>
                        <H6>From</H6>
                        <RNDateTimePicker style={{width: '100%'}} alignSelf="center" value={fromDate} onChange={handleFrom} mode="time" />
                    </Group.Item>
                    <Group.Item>
                        <H6>to</H6>
                        <RNDateTimePicker alignSelf="center" value={toDate} onChange={handleTo} mode="time" />
                    </Group.Item>
                </>}
            </Group>
            <HorizontalContainer width="inherit"
                                 justifyContent="space-between"
                                 alignItems="center"
            >
                <Label htmlFor={'closed' + day}>Closed</Label>
                <Checkbox id={'closed' + day} name="closed" checked={!!closed} onCheckedChange={onClick}>
                    <Checkbox.Indicator>
                        <Check />
                    </Checkbox.Indicator>
                </Checkbox>
            </HorizontalContainer>
            {day !== 'Sun' &&
                <Separator />
            }
        </VerticalContainer>
    )
}

export default React.memo(Hours);