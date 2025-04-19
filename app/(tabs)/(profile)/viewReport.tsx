import {Dimensions, RefreshControl, SafeAreaView, useColorScheme, View} from "react-native";
import {H4, ScrollView, YStack} from "tamagui";
import {BigButton, EditContainer, HorizontalContainer, VerticalContainer} from "@/tamagui.config"
import {useReportContext} from "@/app/(tabs)/(profile)/_layout";
import {
    VictoryAxis,
    VictoryBar,
    VictoryChart,
    VictoryLine,
    VictoryPie,
    VictoryScatter,
    VictoryTheme
} from "victory-native";
import {useEffect, useState} from "react";
import axios from "@/scripts/axiosConfig";
import TransactionsTable from "@/app/(tabs)/(profile)/components/TransactionsTable";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {captureRef} from 'react-native-view-shot';
import {Download} from "@tamagui/lucide-icons";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";

export default function ViewReport() {
    const {oneDay, date, start, end, showDistribution, showPie, items, data, setItems, setData, showLine, showRevenue, showTable, showTransactionTable, showTotal, getReadableDate} = useReportContext();
    const [isLoading, setIsLoading] = useState(true);

    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
    const tabBarHeight = useBottomTabBarHeight();

    const fetchDayData = async () => {
        setIsLoading(true);
        let response;
        try {
            response = await axios.get('/api/transactions/' + getReadableDate(date));
        } catch (error: any) {
            setIsLoading(false);
            console.error(error);
        } finally {
            setIsLoading(false);
            setData((response?.data).sort((a, b) => {
                const dateA = new Date(a.created_at);
                const dateB = new Date(b.created_at);
                return dateA.getTime() - dateB.getTime();
            }));
        }
    }

    const fetchRangeData = async () => {
        setIsLoading(true);
        let response;
        try {
            response = await axios.get('/api/transactions/' + getReadableDate(start) + '/' + getReadableDate(end));
        } catch (error) {
            setIsLoading(false);
            console.error(error);
        } finally {
            setIsLoading(false);
            setData(response?.data);
        }
    }

    useEffect(() => {
        setItemsFromData()
    }, [data, setItems])

    useEffect(() => {
        if (oneDay) {
            fetchDayData();
        } else {
            fetchRangeData();
        }
    }, []);

    const setItemsFromData = () => {
        let newItems = [];
        for (let transaction of data) {
            for (let item of transaction.items) {
                newItems.push(item);
            }
        }
        setItems(newItems);
    }


    const aggregateItems = () => {
        const itemCounts = items.reduce((acc: Record<string, number>, item: {name: string, amount: number}) => {
            acc[item.name] = (acc[item.name] || 0) + item.amount;
            return acc;
        }, {});

        return Object.keys(itemCounts).map(name => ({
            name,
            price: items.find(item => item.name === name).price,
            amount: itemCounts[name]
        }));
    }

    const aggregateTransactions = () => {
        const modifiedData = data.map(transaction => {
            const date = new Date(transaction.created_at);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }
            return {
                created_at: year + '. ' + month + '. ' + day + '.',
                total: transaction.total
            }
        });
        const transactionCounts = modifiedData.reduce((acc, transaction) => {
            acc[transaction.created_at] = (acc[transaction.created_at] || 0) + transaction.total;
            return acc;
        }, {});

        return Object.keys(transactionCounts).map(created_at => ({
            created_at,
            total: transactionCounts[created_at]
        })).sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return dateA.getTime() - dateB.getTime();
        });
    }

    const readableData = () => {
        if (oneDay) {
            return data.map(transaction => {
                const date = new Date(transaction.created_at);
                let hour = date.getHours();
                let minute = date.getMinutes();
                if (hour < 10) {
                    hour = '0' + hour;
                }
                if (minute < 10) {
                    minute = '0' + minute;
                }
                return {
                    created_at: hour + ':' + minute,
                    total: transaction.total
                }
            }).sort((a, b) => {
                const dateA = new Date(`1970-01-01T${a.created_at}:00`);
                const dateB = new Date(`1970-01-01T${b.created_at}:00`);
                return dateA.getTime() - dateB.getTime();
            })
        }
        return aggregateTransactions();
    }

    const handleRefresh = () => {
        setIsLoading(true);
        setItems([]);
        setData([]);
        if (oneDay) {
            fetchDayData();
        } else {
            fetchRangeData();
        }
        setIsLoading(false);
    }

    useEffect(() => {
        return () => {
            setItems([]);
            setData([]);
        };
    }, []);

    return (
        <SafeAreaView>
            <ScrollView height="100%" refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}>
                <YStack marginBottom={tabBarHeight}>
                    {Dimensions.get('window').width >= 768 ? <>
                        <VerticalContainer>
                            <H4
                                padding="$5"
                                borderRadius="$5"
                                marginTop="$5"
                                marginBottom="$5"
                                boxShadow="0px 0px 10px 1px rgba(0,0,0,0.1)"
                                width="90%"
                                alignSelf="center"
                                backgroundColor={theme.colors.card}
                            >{oneDay ? 'Report about ' + getReadableDate(date) : 'Report made from ' + getReadableDate(start) + ' to ' + getReadableDate(end)}</H4>
                            {data.length > 0 ? <>
                                    <HorizontalContainer width="90%" alignSelf="center">
                                        {showDistribution &&
                                            <EditContainer alignItems="center" backgroundColor={theme.colors.card}>
                                                <H4>Distribution of items sold</H4>
                                                <View id="distChartRef">
                                                    {showPie ?
                                                        <VictoryPie
                                                            data={aggregateItems()}
                                                            x="name"
                                                            y="amount"
                                                            key={date ? 'pieChart-' + date : 'pieChart-' + start + '-' + end}
                                                            theme={colorScheme === 'dark' ? VictoryTheme.material : VictoryTheme.grayscale}
                                                            categories={{x: items.map(item => item.name)}}
                                                            width={400}
                                                            height={400}
                                                            padding={60}
                                                        />
                                                        :
                                                        <VictoryChart theme={colorScheme === 'dark' ? VictoryTheme.material : VictoryTheme.grayscale} domainPadding={50}
                                                                      width={500}
                                                                      height={400}
                                                                      key={date ? 'barChart-' + date : 'barChart-' + start + '-' + end}
                                                        >
                                                            <VictoryAxis
                                                                fixLabelOverlap
                                                                style={{
                                                                    tickLabels: {
                                                                        angle: 0,
                                                                        fontSize: 15,
                                                                        padding: 5,
                                                                        color: theme.colors.text
                                                                    }
                                                                }}
                                                            />
                                                            <VictoryAxis
                                                                dependentAxis
                                                                style={{
                                                                    tickLabels: {
                                                                        angle: 0,
                                                                        fontSize: 15,
                                                                        padding: 5,
                                                                        color: theme.colors.text
                                                                    }
                                                                }}
                                                            />
                                                            <VictoryBar
                                                                x="name"
                                                                y="amount"
                                                                data={aggregateItems()}
                                                                animate={{duration: 500}}
                                                            />
                                                        </VictoryChart>
                                                    }
                                                </View>
                                            </EditContainer>
                                        }
                                        {showRevenue &&
                                            <EditContainer
                                                alignItems="center"
                                                backgroundColor={theme.colors.card}
                                            >
                                                <H4>Revenue from transactions</H4>
                                                <VictoryChart
                                                    width={500}
                                                    height={400}
                                                    theme={colorScheme === 'dark' ? VictoryTheme.material : VictoryTheme.grayscale}
                                                    domainPadding={50}
                                                    animate={{duration: 500}}
                                                    key={date ? 'lineChart-' + date : 'lineChart-' + start + '-' + end}
                                                >
                                                    <VictoryAxis
                                                        fixLabelOverlap
                                                        style={{
                                                            tickLabels: {
                                                                angle: 0,
                                                                fontSize: 15,
                                                                padding: 5,
                                                                color: theme.colors.text
                                                            }
                                                        }}
                                                    />
                                                    <VictoryAxis
                                                        dependentAxis
                                                        style={{
                                                            tickLabels: {
                                                                angle: 0,
                                                                fontSize: 15,
                                                                padding: 5,
                                                                color: theme.colors.text
                                                            }
                                                        }}
                                                    />
                                                    {showLine ?
                                                        <VictoryLine data={readableData()} x='created_at' y='total' />
                                                        :
                                                        <VictoryScatter data={readableData()} x='created_at' y='total' />
                                                    }
                                                </VictoryChart>
                                            </EditContainer>
                                        }
                                    </HorizontalContainer>
                                    {showTable &&
                                        <TransactionsTable items={aggregateItems()} transactions={data} distShown={showDistribution} transShown={showTransactionTable} totalShown={showTotal} />
                                    }
                                </> :
                                <EditContainer
                                    backgroundColor={theme.colors.card}
                                >
                                    <H4>No data available for this day</H4>
                                </EditContainer>}
                        </VerticalContainer>
                    </> : <>
                        <EditContainer
                            backgroundColor={theme.colors.card}
                        >
                            <H4>{oneDay ? 'Report about ' + getReadableDate(date) : 'Report made from ' + getReadableDate(start) + ' to ' + getReadableDate(end)}</H4>
                        </EditContainer>
                        {data.length > 0 ? <>
                                {showDistribution &&
                                    <EditContainer alignItems="center"
                                                   backgroundColor={theme.colors.card}
                                    >
                                        <H4>Distribution of items sold</H4>
                                        {showPie ?
                                            <VictoryPie
                                                data={aggregateItems()}
                                                x="name"
                                                y="amount"
                                                theme={colorScheme === 'dark' ? VictoryTheme.material : VictoryTheme.grayscale}
                                                categories={{x: items.map(item => item.name)}}
                                                width={300}
                                                height={300}
                                                padding={60}
                                                key={date ? 'pieChart-' + date : 'pieChart-' + start + '-' + end}
                                            />
                                            :
                                            <VictoryChart
                                                theme={colorScheme === 'dark' ? VictoryTheme.material : VictoryTheme.grayscale}
                                                domainPadding={50}
                                                key={data ? 'barChart-' + date : 'barChart-' + start + '-' + end}
                                            >
                                                <VictoryAxis
                                                    fixLabelOverlap
                                                    style={{
                                                        tickLabels: {
                                                            angle: 0,
                                                            fontSize: 15,
                                                            padding: 5,
                                                            color: theme.colors.text
                                                        }
                                                    }}
                                                />
                                                <VictoryAxis
                                                    dependentAxis
                                                    style={{
                                                        tickLabels: {
                                                            angle: 0,
                                                            fontSize: 15,
                                                            padding: 5,
                                                            color: theme.colors.text
                                                        }
                                                    }}
                                                />
                                                <VictoryBar
                                                    data={aggregateItems().filter(item => item.name && item.amount && !isNaN(item.amount))}
                                                    x="name"
                                                    y="amount"
                                                    animate={{ duration: 500 }}
                                                />
                                            </VictoryChart>
                                        }
                                    </EditContainer>
                                }
                                {showRevenue &&
                                    <EditContainer alignItems="center" backgroundColor={theme.colors.card}>
                                        <H4>Revenue from transactions</H4>
                                        <VictoryChart
                                            width={350}
                                            theme={colorScheme === 'dark' ? VictoryTheme.material : VictoryTheme.grayscale}
                                            domainPadding={50}
                                            animate={{duration: 500}}
                                            key={`lineChart-${date || `${start}-${end}`}`}
                                        >
                                            <VictoryAxis
                                                fixLabelOverlap
                                                style={{
                                                    tickLabels: {
                                                        angle: 0,
                                                        fontSize: 15,
                                                        padding: 5,
                                                        color: theme.colors.text
                                                    }
                                                }}
                                            />
                                            <VictoryAxis
                                                dependentAxis
                                                style={{
                                                    tickLabels: {
                                                        angle: 0,
                                                        fontSize: 15,
                                                        padding: 5,
                                                        color: theme.colors.text
                                                    }
                                                }}
                                            />
                                            {showLine ?
                                                <VictoryLine data={readableData()} x='created_at' y='total' />
                                                :
                                                <VictoryScatter data={readableData()} x='created_at' y='total' />
                                            }
                                        </VictoryChart>
                                    </EditContainer>
                                }
                                {showTable &&
                                    <TransactionsTable items={aggregateItems()} transactions={data} distShown={showDistribution} transShown={showTransactionTable} totalShown={showTotal} />
                                }
                            </> :
                            <EditContainer
                                backgroundColor={theme.colors.card}
                            >
                                <H4>No data available for this day</H4>
                            </EditContainer>}
                    </>}
                </YStack>
            </ScrollView>
        </SafeAreaView>
    )
}