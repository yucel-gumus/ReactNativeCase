import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
    useEffect(() => {
        checkIfUserIsRegistered();
    }, []);
    const checkIfUserIsRegistered = async () => {
        try {
            const userRegistered = await AsyncStorage.getItem('cvFileName');
            console.log(userRegistered)
            if (userRegistered) {
                navigation.navigate('DashBoard');
            } else {
                navigation.navigate('CvAndProject');

            }
        } catch (error) {
            console.error('Kullanıcı kontrolü sırasında bir hata oluştu:', error);
        }
    };

    return (
        <View>
        </View>
    );
};

export default HomeScreen;
