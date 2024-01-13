import React, { useState } from 'react';
import { View, Button, ScrollView, TextInput, Text } from 'react-native';
import { Formik, useFormikContext } from 'formik';
import SelectDropdown from 'react-native-select-dropdown';
import * as Yup from 'yup';

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
  const { setFieldValue, handleSubmit, values, errors } = useFormikContext();
  const [showSecondOptions, setShowSecondOptions] = useState(false);

  const handleOccupationChange = (occupation) => {
    setFieldValue('occupation', occupation);

  };
  return (
    <View>
      <SelectDropdown
        data={['Seçiniz', 'Öğrenci', 'Çalışan', 'İşsiz']}
        onSelect={(selectedItem) => {
          setFieldValue('workCheck', selectedItem);
          setShowSecondOptions(selectedItem === 'Çalışan');
        }}
        defaultButtonText="Çalışma Durumunu Seçiniz"
      />
      <Text style={{ color: 'red' }}>{errors.workCheck}</Text>

      {showSecondOptions && (
        <>
          <Text>Mesleğinizi Seçiniz</Text>
          <SelectDropdown
            data={['Seçiniz', 'Doktor', 'Mühendis', 'Öğretmen']}
            onSelect={(selectedItem, index) => handleOccupationChange(selectedItem)}
            defaultButtonText="Seçiniz"
            buttonTextAfterSelection={(selectedItem, index) => selectedItem}
            rowTextForSelection={(item, index) => item}
          />
          <Text style={{ color: 'red' }}>{errors.occupation}</Text>
        </>
      )}
      <Button title="Devam Et" onPress={handleSubmit} disabled={values.workCheck === 'Seçiniz' || values.occupation === 'Seçiniz'} />
    </View>
  );
};

const WorkAndOccupation = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <Formik
        initialValues={{
          workCheck: null,
          occupation: '',
        }}
        validationSchema={WorkAndOccupationSchema}
        onSubmit={(values) => {
          console.log('Form Values:', values);
          navigation.navigate('EducationPage');
        }}
      >
        <MyForm />
      </Formik>
    </ScrollView>
  );
};

export default WorkAndOccupation;
