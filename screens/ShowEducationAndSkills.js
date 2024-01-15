import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Table, Row } from 'react-native-table-component';

const ShowEducationSkills = ({ navigation }) => {

    const [calismaDurumu, setCalismaDurumu] = useState('')
    const [meslek, setMeslek] = useState('')
    const [okulAdı, setOkulAdı] = useState('')
    const [bölüm, setBölüm] = useState('')
    const [egitimSeviyesi, setEgitimSeviyesi] = useState('')
    const [mezuniyet, setMezuniyet] = useState('')
    const [yetenek, setYetenek] = useState("")
    const tableHead2 = ['Yetenek Adı', 'Derecesi'];
    const [tableData2, setTableData2] = useState([])
    useEffect(() => {
        const getAllDataFromAsyncStorage = async () => {
            try {
                const keys = ['graduationYear', 'schoolName', 'educationLevel', 'department', 'workCheck', 'occupation',];
                const storedData = await AsyncStorage.multiGet(keys);
                const jsonData2 = await AsyncStorage.getItem('skills');
                if (jsonData2 !== null) {
                    const parsedData2 = JSON.parse(jsonData2);
                    setYetenek(jsonData2)
                    const updatedTableData2 = parsedData2.map(item => [item.name, item.level]);
                    setTableData2(updatedTableData2);
                }
                const dataObject = {};
                storedData.forEach(([key, value]) => {
                    dataObject[key] = value;
                });
                if (dataObject) {
                    setCalismaDurumu(dataObject.workCheck)
                    setMeslek(dataObject.occupation)
                    setOkulAdı(dataObject.schoolName)
                    setBölüm(dataObject.department)
                    setEgitimSeviyesi(dataObject.educationLevel)
                    setMezuniyet(dataObject.graduationYear)
                }
            } catch (error) {
                console.error('Error retrieving data from AsyncStorage:', error);
            }
        };
        getAllDataFromAsyncStorage();
    }, []);

    const mezunyılı = new Date(mezuniyet);

    return (
        <View>
            <View style={styles.container}>
                <Text style={styles.cardText}>Çalışma Durumu:     {calismaDurumu}</Text>
                <Text style={styles.cardText}>Meslek Bilgisi:     {meslek}</Text>
                <Text style={styles.cardText}>Mezun Olunan Okul:  {okulAdı}</Text>
                <Text style={styles.cardText}>Mezun Olunan Bölüm: {bölüm}</Text>
                <Text style={styles.cardText}>Eğitim Seviyesi:    {egitimSeviyesi}</Text>
                <Text style={styles.cardText}>Mezuniyet Yılı:     {mezunyılı.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
            </View>
            {/*Yetenek tablosu */}
            <View style={styles.container2}>
                <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9', }}>
                    <Row
                        data={tableHead2}
                        style={styles.head}
                        textStyle={styles.text}
                    />
                    {
                        tableData2.map((rowData, index) => (
                            <Row
                                key={index}
                                data={rowData}
                                style={[styles.row, index % 2 === 0 && { backgroundColor: '#F7F6E7' }]}
                                textStyle={styles.text}
                            />
                        ))
                    }
                </Table>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginLeft: 20
    },

    container2: {
        marginTop: 50,
    },

    cardText: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 5
    },
    head: { height: 40, backgroundColor: '#808B97' },
    text: { margin: 6 },
    row: { flexDirection: 'row', height: 40, backgroundColor: '#FFF1C1' },

});
export default ShowEducationSkills;
