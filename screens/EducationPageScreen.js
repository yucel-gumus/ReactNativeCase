import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';
const educationLevels = ['İlkokul', 'Lise', 'Üniversite'];

const validationSchema = Yup.object().shape({
    educationLevel: Yup.string().required('Eğitim Seviyesi zorunlu.'),
    schoolName: Yup.string().required('Okul Adı zorunlu.'),
    department: Yup.string().required('Bölüm zorunlu.'),
    graduationYear: Yup.string().required('Mezuniyet Yılı zorunlu.'),
    skills: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required('Yetkinlik Adı alanı zorunludur'),
            level: Yup.number().required('Yetkinlik Derecesi alanı zorunludur').positive('Pozitif bir sayı giriniz'),
        })
    ),
});

const EducationPage = ({ navigation }) => {
    const handleSave = async (values) => {
        console.log("geldi", values)
        try {
            const dataToSave = {
                department: values.department,
                educationLevel: values.educationLevel,
                schoolName: values.schoolName,
                graduationYear: values.graduationYear.toISOString(),
                skills: JSON.stringify(values.skills)
            };
            await Promise.all(
                Object.entries(dataToSave).map(async ([key, value]) => {
                    await AsyncStorage.setItem(key, value);
                })
            );
        } catch (error) {
            console.error('Error saving data to AsyncStorage:', error);
            Alert.alert('Error', 'An error occurred while saving data.');
        }
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
                skills: [{ name: '', level: '' }],
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                handleSave(values);
                navigation.navigate('CvAndProject')
            }
            }
        >
            {({ handleChange, handleBlur, setFieldValue, handleSubmit, values, errors, touched }) => (
                <View style={styles.container}>
                    <Text style={{ marginTop: 20 }}>Eğitim Seviyesi:</Text>
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
                            setFieldValue('graduationYear', date);
                        }}
                        onCancel={hideDatePicker}
                        confirmTextIOS='Seç'
                        cancelTextIOS='Kapat'
                    />
                    {touched.graduationYear && errors.graduationYear && (
                        <Text style={styles.errorText}>{errors.graduationYear}</Text>
                    )}
                    <Text style={{ marginTop: 10 }}> Yetkinlik Dereceleri:</Text>
                    <View>
                        <FieldArray
                            name="skills"
                            render={({ remove, push }) => (
                                <View>
                                    {values.skills.map((skill, index) => (
                                        <View key={index}>
                                            <TextInput
                                                style={styles.input}
                                                onChangeText={handleChange(`skills[${index}].name`)}
                                                value={skill.name}
                                                placeholder="Yetkinlik Adı"
                                            />
                                            <TextInput
                                                style={styles.input}
                                                onChangeText={handleChange(`skills[${index}].level`)}
                                                value={skill.number}
                                                keyboardType="numeric"
                                                placeholder="Yetkinlik Derecesi (1-5)"
                                            />
                                            <Button title="Sil" onPress={() => remove(index)} />
                                        </View>
                                    ))}
                                    <Button
                                        title="Ekle"
                                        onPress={() => push({ name: '', level: '' })}
                                    />
                                </View>
                            )}
                        />
                        {errors.skills && touched.skills && (
                            <Text style={{ color: 'red' }}>{errors.skills[0].name || errors.skills[0].level}</Text>
                        )}
                    </View>
                    <Button title="Devam Et" onPress={handleSubmit} />
                </View>
            )}
        </Formik>
    );
};

export default EducationPage;
