import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const educationLevels = ['İlkokul', 'Lise', 'Üniversite'];

const validationSchema = Yup.object().shape({
    educationLevel: Yup.string().required('Eğitim Seviyesi zorunlu.'),
    schoolName: Yup.string().required('Okul Adı zorunlu.'),
    department: Yup.string().required('Bölüm zorunlu.'),
    graduationYear: Yup.string().required('Mezuniyet Yılı zorunlu.'),
    skills: Yup.string().required('Yetkinlikler zorunlu.'),
});

const App = ({ navigation }) => {
    const handleSave = (values) => {
        // Verileri kaydetme işlemleri burada gerçekleştirilebilir.
        console.log('Form Values:', values);
    };


    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    const handleDateConfirm = (date) => {
        hideDatePicker();
        setSelectedDate(date);
    };
    return (
        <Formik
            initialValues={{
                educationLevel: '',
                schoolName: '',
                department: '',
                graduationYear: '',
                skills: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                handleSave(values);
                navigation.navigate('CvAndProject')
            }
            }
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.container}>
                    <Text>Eğitim Seviyesi:</Text>
                    <SelectDropdown
                        data={educationLevels}
                        onSelect={(selectedItem, index) =>
                            handleChange('educationLevel')(selectedItem)
                        }
                        defaultButtonText="Eğitim Seviyesi Seçiniz"
                        buttonTextAfterSelection={(selectedItem, index) =>
                            educationLevels[index]
                        }
                        rowTextForSelection={(item, index) => educationLevels[index]}
                    />
                    {touched.educationLevel && errors.educationLevel && (
                        <Text style={styles.errorText}>{errors.educationLevel}</Text>
                    )}


                    <Text>Okul Bilgileri:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Okul Adı"
                        value={values.schoolName}
                        onChangeText={handleChange('schoolName')}
                        onBlur={handleBlur('schoolName')}
                    />
                    {touched.schoolName && errors.schoolName && (
                        <Text style={styles.errorText}>{errors.schoolName}</Text>
                    )}

                    <TextInput
                        style={styles.input}
                        placeholder="Bölüm"
                        value={values.department}
                        onChangeText={handleChange('department')}
                        onBlur={handleBlur('department')}
                    />
                    {touched.department && errors.department && (
                        <Text style={styles.errorText}>{errors.department}</Text>
                    )}

                    <TextInput
                        style={styles.input}
                        placeholder="Mezuniyet Yılı"
                        value={selectedDate ? `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}` : ''}
                        onTouchStart={showDatePicker}
                        editable={false}
                    />
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={(date) => {
                            handleDateConfirm(date);
                        }}
                        onCancel={hideDatePicker}
                        confirmTextIOS='Seç'
                        cancelTextIOS='Kapat'
                    />
                    {touched.graduationYear && errors.graduationYear && (
                        <Text style={styles.errorText}>{errors.graduationYear}</Text>
                    )}
                    <Text style={{ marginTop: 10 }}> Yetkinlik Dereceleri:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Yetkinlikler"
                        value={values.skills}
                        onChangeText={handleChange('skills')}
                        onBlur={handleBlur('skills')}
                    />
                    {touched.skills && errors.skills && (
                        <Text style={styles.errorText}>{errors.skills}</Text>
                    )}

                    <Button title="Devam Et" onPress={handleSubmit} />
                </View>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#00dfff',
        padding: 8,
        marginTop: 10
    },
    errorText: {
        color: 'red',
    },
});

export default App;
