import React, { useState } from 'react';
import { View, Button, ScrollView, StyleSheet, TextInput, Text, Alert } from 'react-native';
import { Formik, useFormikContext } from 'formik';
import SelectDropdown from 'react-native-select-dropdown';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import still from '../styles'

const WorkAndOccupationSchema = Yup.object().shape({
  workCheck: Yup.string().required('Çalışma durumu seçimi zorunludur'),
  occupation: Yup.string().test('isRequired', 'Meslek bilgisi girişi zorunludur', function (value) {
    const { workCheck } = this.parent;
    if (workCheck === 'Çalışan') {
      return !!value;
    }
    return true;
  }),
});

const MyForm = () => {
  const { setFieldValue, handleSubmit, touched, values, errors } = useFormikContext();

  const [showSecondOptions, setShowSecondOptions] = useState(false);
  const [selectedOccupation, setSelectedOccupation] = useState('');
  const [customOccupation, setCustomOccupation] = useState('');

  const handleOccupationChange = (occupation) => {
    setFieldValue('occupation', occupation);
    setSelectedOccupation(occupation);
    setCustomOccupation('');
  };

  const handleCustomOccupationChange = (text) => {
    setSelectedOccupation('');
    setCustomOccupation(text);
    setFieldValue('occupation', text);
  };

  const renderDropdownButton = () => {
    if (selectedOccupation) {
      return selectedOccupation;
    } else if (customOccupation) {
      return customOccupation;
    } else {
      return 'Seçiniz';
    }
  };

  console.log(customOccupation)
  console.log(selectedOccupation)
  return (
    <View>
      <SelectDropdown
        data={['Seçiniz', 'Öğrenci', 'Çalışan', 'İşsiz']}
        onSelect={(selectedItem) => {
          setFieldValue('workCheck', selectedItem);
          setShowSecondOptions(selectedItem === 'Çalışan');
        }}
        defaultButtonText="Çalışma Durumunuz"
      />

      <Text style={{ color: 'red' }}>{errors.workCheck}</Text>
      {showSecondOptions && (
        <>
          <TextInput
            style={still.input}
            placeholder="Meslek giriniz veya seçiniz"
            value={customOccupation}
            onChangeText={handleCustomOccupationChange}
          />
          <SelectDropdown
            data={['Seçiniz', 'Doktor', 'Mühendis', 'Öğretmen', 'Asker']}
            onSelect={(selectedItem) => handleOccupationChange(selectedItem)}
            defaultButtonText={renderDropdownButton()}
            buttonTextAfterSelection={() => (selectedOccupation ? selectedOccupation : customOccupation)}
            rowTextForSelection={(item) => item}
          />
          {touched.occupation && errors.occupation && (
            <Text style={{ color: 'red' }}>{errors.occupation}</Text>
          )}
        </>
      )}
      <Button
        title="Devam Et"
        onPress={handleSubmit}
        disabled={values.workCheck === 'Seçiniz' || values.occupation === 'Seçiniz'}
      />
    </View>
  );
};

const WorkAndOccupation = ({ navigation }) => {
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <Formik
        initialValues={{
          workCheck: null,
          occupation: '',
        }}
        validationSchema={WorkAndOccupationSchema}
        onSubmit={async (values) => {
          try {
            console.log(values);
            await AsyncStorage.setItem('workCheck', values.workCheck);
            if (values.workCheck === 'Çalışan') {
              await AsyncStorage.setItem('occupation', values.occupation);
            }
            navigation.navigate('EducationPage');
          } catch (error) {
            console.error('Error saving data to AsyncStorage:', error);
            Alert.alert('Error', 'An error occurred while saving data.');
          }
        }}
      >
        <MyForm />
      </Formik>
    </ScrollView>
  );
};

export default WorkAndOccupation;
