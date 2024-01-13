import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardScreen = ({ navigation }) => {
    const [cvFileName, setCvFileName] = useState('');

    const handleLogout = () => {
        // You can implement your logout logic here
        // For simplicity, let's assume there is a logout function in your navigation
        navigation.navigate('Login'); // Replace 'Login' with the name of your login screen
    };
    useEffect(() => {
        // Retrieve CV file name from AsyncStorage
        const getCvFileName = async () => {
            try {
                const storedCvFileName = await AsyncStorage.getItem('cvFileName');
                if (storedCvFileName) {
                    setCvFileName(storedCvFileName);
                }
            } catch (error) {
                console.error('Error retrieving CV file name from AsyncStorage:', error);
            }
        };

        getCvFileName();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Dashboard</Text>

            <View style={styles.card}>
                <Text style={styles.cardText}>{cvFileName}</Text>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        marginBottom: 20,
    },
    cardText: {
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: 'tomato',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});


export default DashboardScreen;
