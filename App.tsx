import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegistrationScreen from './screens/RegistrationScreen';
import WorkAndOccupationScreen from './screens/WorkAndOccupationScreen';
import EducationPageScreen from './screens/EducationPageScreen';
import CvAndProjectScreen from './screens/CvAndProjectScreen';
import DashboardScreen from './screens/DashboardScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="DashBoard" component={DashboardScreen} options={{
          title: 'Dashboard', gestureEnabled: false,
          headerShown: true,
          headerLeft: () => <></>,
        }} />
        <Stack.Screen name="Registration" component={RegistrationScreen} options={{
          title: 'Kullanıcı Kayıt Ekranı', gestureEnabled: false,
          headerShown: true,
          headerLeft: () => <></>,
        }} />
        <Stack.Screen name="WorkAndOccupation" component={WorkAndOccupationScreen} options={{ title: 'Çalışma Durumu ve Meslek Bilgileri' }} />
        <Stack.Screen name="EducationPage" component={EducationPageScreen} options={{ title: 'Eğitim Seviyesi ve Yetkinlik Bilgileri' }} />
        <Stack.Screen name="CvAndProject" component={CvAndProjectScreen} options={{ title: 'Cv ve Proje Alanı' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
