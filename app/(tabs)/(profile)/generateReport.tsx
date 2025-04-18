import {Platform, SafeAreaView, useColorScheme} from "react-native";
import {Checkbox, H4, H6, Label, ScrollView, Separator} from "tamagui";
import {
    BigButton,
    EditContainer,
    HorizontalContainer,
    SmallButtonWithAccent,
    VerticalContainer
} from "@/tamagui.config";
import {Picker} from '@react-native-picker/picker';
import RNDateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {Check, LineChart} from "@tamagui/lucide-icons";
import {router} from "expo-router";
import {useReportContext} from "@/app/(tabs)/(profile)/_layout";
import {useState} from "react";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";

export default function GenerateReport() {
    const {date, setDate, start, setStart, end, setEnd, oneDay, setOneDay, showDistribution, setShowDistribution, showRevenue, setShowRevenue, showTable, setShowTable, showPie, setShowPie, showLine, setShowLine, showDistTable, setShowDistTable, setShowTransactionTable, showTotal, setShowTotal, getReadableDate} = useReportContext();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;
    const tabBarHeight = useBottomTabBarHeight();

    const handleSetDate = (event: DateTimePickerEvent, date: Date) => {
        const {
            type,
            nativeEvent: {timestamp, utcOffset},
        } = event;
        if (type === 'dismissed') {
            setShowDatePicker(false);
            return;
        }
        setDate(date);
        setShowDatePicker(false);
    }

    const handleSetStart = (event: DateTimePickerEvent, date: Date) => {
        const {
            type,
            nativeEvent: {timestamp, utcOffset},
        } = event;
        if (type === 'dismissed') {
            setShowStartPicker(false);
            return;
        }
        setStart(date);
        setShowStartPicker(false);
    }

    const handleSetEnd = (event: DateTimePickerEvent, date: Date) => {
        const {
            type,
            nativeEvent: {timestamp, utcOffset},
        } = event;
        if (type === 'dismissed') {
            setShowEndPicker(false);
            return;
        }
        setEnd(date);
        setShowEndPicker(false);
    }

    const handleTableStyle = (value) => {
        switch (value) {
            case 'Distribution':
                setShowDistTable(true);
                setShowTransactionTable(false);
                setShowTotal(false);
                break;
            case 'Transactions':
                setShowDistTable(false);
                setShowTransactionTable(true);
                setShowTotal(false);
                break;
            case 'All':
                setShowDistTable(true);
                setShowTransactionTable(true);
                setShowTotal(true);
                break;
        }
    }

    return (
        <SafeAreaView>
            <ScrollView style={{height: '100%'}} keyboardDismissMode='interactive' automaticallyAdjustKeyboardInsets={true}>
                <EditContainer
                    backgroundColor={theme.colors.card}
                    marginBottom={tabBarHeight}
                >
                    <VerticalContainer>
                        <H4>Get data from</H4>
                        <Picker id="day" selectedValue={oneDay ? 'one day' : 'range'} onValueChange={(itemValue) => setOneDay(itemValue === 'one day')}>
                            <Picker.Item label="one day" value="one day"/>
                            <Picker.Item label="range" value="range"/>
                        </Picker>
                    </VerticalContainer>
                    <Separator />
                    {oneDay ? <HorizontalContainer alignItems="center" justifyContent="space-between">
                        <H6>Select date:</H6>
                        {Platform.OS === 'android' ? <>
                            <SmallButtonWithAccent onPress={setShowDatePicker}>{getReadableDate(date)}</SmallButtonWithAccent>
                            {showDatePicker &&
                                <RNDateTimePicker display="calendar" style={{width: '100%'}} value={date} onChange={handleSetDate} alignSelf="center" mode="date" />
                            }
                        </> : <>
                            <RNDateTimePicker style={{width: '100%'}} value={date} onChange={handleSetDate} alignSelf="center" mode="date" />
                        </>}
                    </HorizontalContainer> : <VerticalContainer>
                        <HorizontalContainer alignItems="center" justifyContent="space-between">
                            <H6>From</H6>
                            {Platform.OS === 'android' ? <>
                                <SmallButtonWithAccent onPress={setShowStartPicker}>{getReadableDate(start)}</SmallButtonWithAccent>
                                {showStartPicker &&
                                    <RNDateTimePicker display="calendar" style={{width: '100%'}} value={start} onChange={handleSetStart} alignSelf="center" mode="date" />
                                }
                            </> : <>
                                <RNDateTimePicker style={{width: '100%'}} value={start} onChange={handleSetStart} alignSelf="center" mode="date" />
                            </>}

                        </HorizontalContainer>
                        <Separator />
                        <HorizontalContainer alignItems="center" justifyContent="space-between">
                            <H6>To</H6>
                            {Platform.OS === 'android' ? <>
                                <SmallButtonWithAccent onPress={setShowEndPicker}>{getReadableDate(end)}</SmallButtonWithAccent>
                                {showEndPicker &&
                                    <RNDateTimePicker display="calendar" style={{width: '100%'}} value={end} onChange={handleSetEnd} alignSelf="center" mode="date" />
                                }
                            </> : <>
                                <RNDateTimePicker style={{width: '100%'}} value={end} onChange={handleSetEnd} alignSelf="center" mode="date" />
                            </>}
                        </HorizontalContainer>
                    </VerticalContainer>}
                    <Separator />
                    <H4>Options</H4>
                    <VerticalContainer>
                        <HorizontalContainer alignItems="center">
                            <Label htmlFor="dist">
                                <H6>Distribution</H6>
                            </Label>
                            <Checkbox id="dist" checked={showDistribution} onCheckedChange={() => setShowDistribution(!showDistribution)}>
                                <Checkbox.Indicator>
                                    <Check />
                                </Checkbox.Indicator>
                            </Checkbox>
                        </HorizontalContainer>
                        {showDistribution &&
                            <>
                                <H6>Style:</H6>
                                <Picker selectedValue={showPie ? 'Pie' : 'Bar'} onValueChange={(itemValue) => setShowPie(itemValue === 'Pie')}>
                                    <Picker.Item label="Pie" value="Pie"/>
                                    <Picker.Item label="Bar" value="Bar"/>
                                </Picker>
                            </>
                        }
                    </VerticalContainer>
                    <Separator />
                    <VerticalContainer>
                        <HorizontalContainer alignItems="center">
                            <Label htmlFor="rev">
                                <H6>Revenue</H6>
                            </Label>
                            <Checkbox id="rev" checked={showRevenue} onCheckedChange={() => setShowRevenue(!showRevenue)}>
                                <Checkbox.Indicator>
                                    <Check />
                                </Checkbox.Indicator>
                            </Checkbox>
                        </HorizontalContainer>
                        {showRevenue &&
                            <>
                                <H6>Style:</H6>
                                <Picker selectedValue={Platform.OS === 'ios' ? showLine ? 'Line' : 'Scatter' : 'Scatter'} onValueChange={(itemValue) => setShowLine(itemValue === 'Line')}>
                                    {Platform.OS === 'android' ?
                                        <Picker.Item enabled={false} label="Line (This option is unavailable on android)" value="Line"/>
                                        :
                                        <Picker.Item label="Line" value="Line"/>
                                    }
                                    <Picker.Item label="Scatter" value="Scatter"/>
                                </Picker>
                            </>
                        }
                    </VerticalContainer>
                    <Separator />
                    <VerticalContainer>
                        <VerticalContainer>
                            <HorizontalContainer alignItems="center">
                                <Label htmlFor="table">
                                    <H6>Transactions table</H6>
                                </Label>
                                <Checkbox id="table" checked={showTable} onCheckedChange={() => setShowTable(!showTable)}>
                                    <Checkbox.Indicator>
                                        <Check />
                                    </Checkbox.Indicator>
                                </Checkbox>
                            </HorizontalContainer>
                            {showTable &&
                                <>
                                    <H6>Show:</H6>
                                    <Picker selectedValue={showTotal ? 'All' : showDistTable ? 'Distribution' : 'Transactions'} onValueChange={(itemValue) => handleTableStyle(itemValue)} >
                                        <Picker.Item label="Distribution" value="Distribution"/>
                                        <Picker.Item label="Transactions" value="Transactions"/>
                                        <Picker.Item label="All" value="All"/>
                                    </Picker>
                                </>
                            }
                        </VerticalContainer>
                        {showTable && <HorizontalContainer alignItems="center">
                            <Label htmlFor="tableTotal">
                                <H6>Show total</H6>
                            </Label>
                            <Checkbox id="tableTotal" checked={showTotal} onCheckedChange={() => setShowTotal(!showTotal)}>
                                <Checkbox.Indicator>
                                    <Check />
                                </Checkbox.Indicator>
                            </Checkbox>
                        </HorizontalContainer>}
                        <Separator />
                        <BigButton icon={LineChart} onPress={() => router.push('/viewReport')}>Generate report</BigButton>
                    </VerticalContainer>
                </EditContainer>
            </ScrollView>
        </SafeAreaView>
    )
}