import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import { Table, Row } from 'react-native-table-component';
import Modal from 'react-native-modal';

const ShowCvAndProject = ({ navigation }) => {
    const [cvFileName, setCvFileName] = useState("")
    const [cvUrl, setCvUrl] = useState("");
    const [pdfData, setPdfData] = useState(null);
    const [pdfVisible, setPdfVisible] = useState(false);
    const [projeler, setProjeler] = useState("");
    const tableHead = ['Proje Adı', 'Proje Açıklaması'];
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const getAllDataFromAsyncStorage = async () => {
            try {
                const keys = ['cvUri', 'cvFileName'];
                const storedData = await AsyncStorage.multiGet(keys);
                const jsonData = await AsyncStorage.getItem('projectContent');

                if (jsonData !== null) {
                    const parsedData = JSON.parse(jsonData);
                    setProjeler(parsedData);
                    const updatedTableData = parsedData.map(item => [item.name, item.description]);
                    setTableData(updatedTableData);
                }
                const dataObject = Object.fromEntries(storedData);
                if (dataObject) {
                    setCvFileName(dataObject.cvFileName);
                    setCvUrl(dataObject.cvUri);
                }
            } catch (error) {
                console.error('Error retrieving data from AsyncStorage:', error);
            }
        };

        getAllDataFromAsyncStorage();
    }, []);

    const openPdf = async () => {
        try {
            if (cvUrl) {
                console.log('cvUrl:', cvUrl);

                if (cvUrl.startsWith('file://')) {
                    cvUrl = cvUrl.replace('file://', '');
                }

                console.log('Processed filePath:', cvUrl); // Add this line for additional logging

                const resolvedPath = RNFS.resolvePath(cvUrl);
                const fileExists = await RNFS.exists(resolvedPath);

                if (fileExists) {
                    try {
                        const fileStats = await RNFS.stat(cvUrl);
                        console.log('File stats:', fileStats);

                        const fileContent = await RNFS.readFile(cvUrl, 'base64');
                        console.log('File content length:', fileContent.length);
                        console.log('File content:', fileContent);

                        if (fileContent) {
                            setPdfData(`data:application/pdf;base64,${fileContent}`);
                            setPdfVisible(true);
                        } else {
                            Alert.alert('Error', 'Failed to read PDF file.');
                        }
                    } catch (readFileError) {
                        console.error('Error reading PDF file:', readFileError);
                        Alert.alert('Error', `Failed to read PDF file. Details: ${readFileError.message}`);
                    }
                } else {
                    Alert.alert('Error', 'File not found at the specified path.');
                }
            } else {
                console.error('CV file not found or undefined.');
            }
        } catch (error) {
            console.error('Error opening PDF:', error);
        }
    };

    const closePdf = () => {
        setPdfVisible(false);
    };
    return (
        <View >
            <View style={styles.card}>
                <Text>Yüklenen CV </Text>
                {!pdfVisible && <Button title={String(cvFileName)} onPress={openPdf} />}
            </View>

            <Modal isVisible={pdfVisible}>
                <View style={styles.pdf}>
                    <Pdf source={{ uri: pdfData, cache: true }} style={styles.pdf} />
                    <Button title="PDF Kapat" onPress={closePdf} />
                </View>
            </Modal>

            {/* Project Table */}
            <View style={{ flex: 1, marginTop: 100 }}>
                <Table>
                    <Row data={tableHead} style={styles.head} textStyle={styles.text} />
                    {tableData.map((rowData, index) => (
                        <Row
                            key={index}
                            data={rowData}
                            style={[styles.row, index % 2 === 0 && styles.evenRow]}
                            textStyle={styles.text}
                        />
                    ))}
                </Table>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
        marginTop: 25
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        padding: 20,
        justifyContent: "center",
        alignContent: "center",
        alignItems: 'center',
        marginTop: 30

    },
    cardText: {
        fontSize: 16,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    container2: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#808B97' },
    text: { margin: 6 },
    row: { flexDirection: 'row', height: 40, backgroundColor: '#FFF1C1' },
    pdfViewer: {
        flex: 1,
        width: '100%',
    },

});


export default ShowCvAndProject;
