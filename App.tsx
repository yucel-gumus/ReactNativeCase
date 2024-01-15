import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import RegistrationScreen from './screens/RegistrationScreen';
import WorkAndOccupationScreen from './screens/WorkAndOccupationScreen';
import EducationPageScreen from './screens/EducationPageScreen';
import CvAndProjectScreen from './screens/CvAndProjectScreen';
import ShowCvAndProjectScreen from './screens/ShowCvAndProject'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faBriefcase } from '@fortawesome/free-solid-svg-icons/faBriefcase'
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons/faGraduationCap'
import { faFileImport } from '@fortawesome/free-solid-svg-icons/faFileImport'
import DashboardScreen from './screens/DashboardScreen';
import ShowEducationSkills from './screens/ShowEducationAndSkills';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function App() {
  const [isWorkAndOccupationActive, setIsWorkAndOccupationActive] = useState(false);
  const [isEducationActive, setIsEducationActive] = useState(false);
  const [isCvActive, setIsCvActive] = useState(false);
  const [loginControl, setLoginControl] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const [fullname, workCheck, educationLevel, userRegistered] = await Promise.all([
        AsyncStorage.getItem('fullName'),
        AsyncStorage.getItem('workCheck'),
        AsyncStorage.getItem('educationLevel'),
        AsyncStorage.getItem('cvFileName'),
      ]);

      setIsWorkAndOccupationActive(!!fullname);
      setIsEducationActive(!!workCheck);
      setIsCvActive(!!educationLevel);

      if (userRegistered) {
        setLoginControl(true);
      }
    };
    fetchData();
  }, []);
  console.log(isWorkAndOccupationActive)
  if (loginControl === false) {
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              if (route.name === 'Registration') {
                return <FontAwesomeIcon icon={faUser} size={size} color={color} />;
              } else if (route.name === 'WorkAndOccupation') {
                return <FontAwesomeIcon icon={faBriefcase} size={size} color={color} />;
              }
              else if (route.name === 'EducationPage') {
                return <FontAwesomeIcon icon={faGraduationCap} size={size} color={color} />;
              }
              else if (route.name === 'CvAndProject') {
                return <FontAwesomeIcon icon={faFileImport} size={size} color={color} />;
              }
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen
            name="Registration"
            component={RegistrationScreen}
            options={{
              title: 'Kullanıcı Kayıt Ekranı',
              tabBarLabel: "Kişisel Bilgiler"
            }}
          />
          <Tab.Screen
            name="WorkAndOccupation"
            component={WorkAndOccupationScreen}
            options={{
              title: 'Çalışma Durumu ve Meslek Bilgileri',
              tabBarLabel: "Çalışma ve Meslek"
            }}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                if (!isWorkAndOccupationActive) {
                  e.preventDefault();
                }
              },
            })}
          />
          <Tab.Screen
            name="EducationPage"
            component={EducationPageScreen}
            options={{ title: 'Eğitim Seviyesi ve Yetkinlik Bilgileri', tabBarLabel: "Eğitim ve Yetkinlik" }}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                if (!isEducationActive) {
                  e.preventDefault();
                }
              },
            })}
          />
          <Tab.Screen
            name="CvAndProject"
            component={CvAndProjectScreen}
            options={{ title: 'Cv ve Proje Alanı', tabBarLabel: "CV ve Projeler" }}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                if (!isCvActive) {
                  e.preventDefault();
                }
              },
            })}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{
            drawerStyle: {
              backgroundColor: '#c6cbef',
              width: 250,
            },
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            }
          }}>
          <Drawer.Screen
            name="DashBoard"
            options={{
              drawerLabel: 'Dashboard',
              title: 'Dashboard'
            }}
            component={DashboardScreen} />
          <Drawer.Screen
            name="ShowCvAndProject"
            options={{
              drawerLabel: 'Cv ve Projeler',
              title: 'Cv ve Projeler'
            }}
            component={ShowCvAndProjectScreen} />
          <Drawer.Screen
            name="ShowEducationSkills"
            options={{
              drawerLabel: 'Eğitim ve Yetenekler',
              title: 'Eğitim ve Yetenekler'
            }}
            component={ShowEducationSkills} />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
