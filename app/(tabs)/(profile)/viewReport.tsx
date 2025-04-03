import {Dimensions, RefreshControl, SafeAreaView, View} from "react-native";
import {H4, ScrollView} from "tamagui";
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
import RNHTMLtoPDF from 'react-native-html-to-pdf';

export default function ViewReport() {
    const {oneDay, date, start, end, showDistribution, showPie, items, data, setItems, setData, showLine, showRevenue, showTable, showTransactionTable, showTotal} = useReportContext();
    const [isLoading, setIsLoading] = useState(true);

    const getReadableDate = (date: Date) => {
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString();
        let day = (date.getDate()).toString();
        if (parseInt(month) < 10) {
            month = '0' + month;
        }
        if (parseInt(day) < 10) {
            day = '0' + day;
        }
        return year + '-' + month + '-' + day;
    }

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
            setData(response?.data);
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
    }, [data])

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
        const itemCounts = items.reduce((acc, item) => {
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
        const modifiedData = data.map((transaction: any) => {
            const date = new Date(transaction.created_at);
            let year = date.getFullYear();
            let month = (date.getMonth() + 1).toString();
            let day = (date.getDate()).toString();
            if (parseInt(month) < 10) {
                month = '0' + month;
            }
            if (parseInt(day) < 10) {
                day = '0' + day;
            }
            return {
                created_at: year + '. ' + month + '. ' + day + '.',
                total: transaction.total
            }
        });
        const transactionCounts = modifiedData.reduce((acc: any, transaction: any) => {
            acc[transaction.created_at] = (acc[transaction.created_at] || 0) + transaction.total;
            return acc;
        }, {});

        return Object.keys(transactionCounts).map(created_at => ({
            created_at,
            total: transactionCounts[created_at]
        }));
    }

    const readableData = () => {
        if (oneDay) {
            return data.map((transaction: any) => {
                const date = new Date(transaction.created_at);
                let hour = (date.getHours()).toString();
                let minute = (date.getMinutes()).toString();
                if (parseInt(hour) < 10) {
                    hour = '0' + hour;
                }
                if (parseInt(minute) < 10) {
                    minute = '0' + minute;
                }
                return {
                    created_at: hour + ':' + minute,
                    total: transaction.total
                }
            })
        }
        return aggregateTransactions();
    }

    const handleRefresh = () => {
        setIsLoading(true);
        if (oneDay) {
            fetchDayData();
        } else {
            fetchRangeData();
        }
        setIsLoading(false);
    }

    // const handleDownloadReport = async () => {
    //     try {
    //         // const pdfDoc = <MyDocument />;
    //         // const pdfBlob = await pdf(pdfDoc).toBlob(); // Generate PDF as a blob
    //         let options = {
    //             html: '<h1>Halo</h1>',
    //             fileName: 'test',
    //             directory: 'Documents',
    //         }
    //         let file = await RNHTMLtoPDF.convert(options);
    //
    //         const pdfUri = FileSystem.cacheDirectory + 'report.pdf';
    //         await FileSystem.writeAsStringAsync(pdfUri, await pdfBlob.arrayBuffer(), {
    //             encoding: FileSystem.EncodingType.Base64,
    //         });
    //
    //         if (await Sharing.isAvailableAsync()) {
    //             await Sharing.shareAsync(pdfUri);
    //         } else {
    //             console.log('Sharing is not available');
    //         }
    //     } catch (error) {
    //         console.error('Error generating PDF:', error);
    //     }
    // };
    //
    // const captureComponent = async (ref: string) => {
    //     return await captureRef(ref, {format: 'png', quality: 1});
    // };

    // const MyDocument = () => {
    //     const distChartImage = captureComponent('distChartRef');
    //     const revenueChartImage = captureComponent('revenueChartRef');
    //     const tableImage = captureComponent('tableRef');
    //     return (
    //         <Document>
    //             <Page size="A4">
    //                 <Text>Report</Text>
    //                 <Text>This is a report about the transactions made.</Text>
    //                 {/* Add more content here */}
    //             </Page>
    //         </Document>
    //     );
    // }

    return (
        <SafeAreaView>
            <ScrollView height="100%" refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />} >
                {Dimensions.get('window').width >= 768 ? <>
                    <VerticalContainer>
                        <H4
                            padding="$5"
                            borderRadius="$5"
                            marginTop="$5"
                            marginBottom="$5"
                            boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 0 8px 0 rgba(0, 0, 0, 0.2)"
                            width="90%"
                            alignSelf="center"
                        >{oneDay ? 'Report about ' + getReadableDate(date) : 'Report made from ' + getReadableDate(start) + ' to ' + getReadableDate(end)}</H4>
                        {data.length > 0 ? <>
                            <HorizontalContainer width="90%" alignSelf="center">
                                {showDistribution &&
                                    <EditContainer alignItems="center">
                                        <H4>Distribution of items sold</H4>
                                        <View id="distChartRef">
                                            {showPie ?
                                                <VictoryPie
                                                    data={aggregateItems()}
                                                    x="name"
                                                    y="amount"
                                                    theme={VictoryTheme.grayscale}
                                                    categories={{x: items.map(item => item.name)}}
                                                    width={400}
                                                    height={400}
                                                    padding={60}
                                                />
                                                :
                                                <VictoryChart theme={VictoryTheme.grayscale} domainPadding={50}
                                                              width={550}
                                                              height={400}
                                                >
                                                    <VictoryAxis
                                                        fixLabelOverlap
                                                        style={{
                                                            tickLabels: {
                                                                angle: 0,
                                                                fontSize: 15,
                                                                padding: 5
                                                            }
                                                        }}
                                                    />
                                                    <VictoryAxis
                                                        dependentAxis
                                                        style={{
                                                            tickLabels: {
                                                                angle: 0,
                                                                fontSize: 15,
                                                                padding: 5
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
                                    >
                                        <H4>Revenue from transactions</H4>
                                        <VictoryChart
                                            width={550}
                                            height={400}
                                            theme={VictoryTheme.grayscale}
                                            domainPadding={50}
                                            animate={{duration: 500}}
                                        >
                                            <VictoryAxis
                                                fixLabelOverlap
                                                style={{
                                                    tickLabels: {
                                                        angle: 0,
                                                        fontSize: 15,
                                                        padding: 5
                                                    }
                                                }}
                                            />
                                            <VictoryAxis
                                                dependentAxis
                                                style={{
                                                    tickLabels: {
                                                        angle: 0,
                                                        fontSize: 15,
                                                        padding: 5
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
                            <EditContainer>
                                <H4>No data available for this day</H4>
                            </EditContainer>}
                    </VerticalContainer>
                </> : <>
                    <EditContainer>
                        <H4>{oneDay ? 'Report about ' + getReadableDate(date) : 'Report made from ' + getReadableDate(start) + ' to ' + getReadableDate(end)}</H4>
                    </EditContainer>
                    {data.length > 0 ? <>
                            {showDistribution &&
                                <EditContainer alignItems="center">
                                    <H4>Distribution of items sold</H4>
                                    {showPie ?
                                        <VictoryPie
                                            data={aggregateItems()}
                                            x="name"
                                            y="amount"
                                            theme={VictoryTheme.grayscale}
                                            categories={{x: items.map(item => item.name)}}
                                            width={300}
                                            height={300}
                                            padding={60}
                                        />
                                        :
                                        <VictoryChart theme={VictoryTheme.grayscale} domainPadding={50}>
                                            <VictoryAxis
                                                fixLabelOverlap
                                                style={{
                                                    tickLabels: {
                                                        angle: 0,
                                                        fontSize: 15,
                                                        padding: 5
                                                    }
                                                }}
                                            />
                                            <VictoryAxis
                                                dependentAxis
                                                style={{
                                                    tickLabels: {
                                                        angle: 0,
                                                        fontSize: 15,
                                                        padding: 5
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
                                </EditContainer>
                            }
                            {showRevenue &&
                                <EditContainer alignItems="center">
                                    <H4>Revenue from transactions</H4>
                                    <VictoryChart
                                        width={350}
                                        theme={VictoryTheme.grayscale}
                                        domainPadding={50}
                                        animate={{duration: 500}}
                                    >
                                        <VictoryAxis
                                            fixLabelOverlap
                                            style={{
                                                tickLabels: {
                                                    angle: 0,
                                                    fontSize: 15,
                                                    padding: 5
                                                }
                                            }}
                                        />
                                        <VictoryAxis
                                            dependentAxis
                                            style={{
                                                tickLabels: {
                                                    angle: 0,
                                                    fontSize: 15,
                                                    padding: 5
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
                        <EditContainer>
                            <H4>No data available for this day</H4>
                        </EditContainer>}
                </>}
                {/*<EditContainer>*/}
                {/*    <BigButton icon={Download} onPress={handleDownloadReport}>Download PDF</BigButton>*/}
                {/*</EditContainer>*/}
            </ScrollView>
        </SafeAreaView>
    )
}