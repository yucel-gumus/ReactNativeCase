import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const DashboardScreen = ({ navigation }) => {
    const [adSoyad, setAdSoyad] = useState('');
    const [tc, setTc] = useState('');
    const [telefon, setTelefon] = useState('');
    const [dogum, setDogum] = useState('');
    const [cinsiyet, setCinsiyet] = useState('');
    const [sehir, setSehir] = useState('');
    const [ulke, setUlke] = useState('');
    const [resim, setResim] = useState('')
    useEffect(() => {
        const getAllDataFromAsyncStorage = async () => {
            try {
                const keys = ['userPhoto', 'country', 'city', 'birthDate', 'fullName', 'gender', 'phoneNumber', 'uniqueID'];
                const storedData = await AsyncStorage.multiGet(keys);
                const dataObject = {};
                storedData.forEach(([key, value]) => {
                    dataObject[key] = value;
                });
                console.log(dataObject)
                if (dataObject) {
                    setDogum(dataObject.birthDate);
                    setTc(dataObject.uniqueID);
                    setAdSoyad(dataObject.fullName);
                    setCinsiyet(dataObject.gender);
                    setTelefon(dataObject.phoneNumber);
                    setSehir(dataObject.city);
                    setUlke(dataObject.country)
                    setResim(dataObject.userPhoto)
                }
            } catch (error) {
                console.error('Error retrieving data from AsyncStorage:', error);
            }
        };
        getAllDataFromAsyncStorage();
    }, []);
    const dogumyılı = new Date(dogum)
    return (
        <View style={styles.container}>
            <View style={{ overflow: 'hidden' }}>
                {resim && (
                    <Image
                        source={{ uri: resim }}
                        style={{
                            width: 200,
                            height: 200,
                            borderRadius: 10,

                        }}
                    />
                )}
                {/* Diğer dashboard içeriğinizi buraya ekleyin */}
            </View>
            <View style={styles.card}>
                <Text style={styles.cardText}>Ad Soyad:{adSoyad}</Text>
                <Text style={styles.cardText}>TC:{tc}</Text>
                <Text style={styles.cardText}>Telefon:{telefon}</Text>
                <Text style={styles.cardText}>Cinsiyet:{cinsiyet}</Text>
                <Text style={styles.cardText}>Doğum Tarihi:{dogumyılı.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                <Text style={styles.cardText}>Ülke:{ulke}</Text>
                <Text style={styles.cardText}>Şehir:{sehir}</Text>
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
        backgroundColor: '#fff',
        padding: 20,
        marginTop: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 2,
        overflow: 'scroll'
    },
    cardText: {
        fontSize: 16,
        marginTop: 10
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

});


export default DashboardScreen;
