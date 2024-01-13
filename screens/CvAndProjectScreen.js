import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, Button, StyleSheet } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = ({ navigation }) => {
    const [cvFileName, setCvFileName] = useState('');
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [projectFields, setProjectFields] = useState([{ id: 1, name: '', description: '' }]);

    const formik = useFormik({
        initialValues: {
            projectName: '',
            cv: '',
            projectDescription: '',
        },
        validationSchema: Yup.object().shape({
            cv: Yup.string()
                .required('CV yüklemek zorunludur.')
                .test('is-pdf', 'Sadece PDF dosyaları desteklenir.', value => {
                    return value && value.endsWith('.pdf');
                }),
            projectName: Yup.string().test('isRequired', 'Meslek bilgisi girişi zorunludur', function (value) {
                const { showProjectForm } = this.parent;
                if (showProjectForm === false) {
                    return !!value;
                }
                return true;
            }),
            projectDescription: Yup.string().when('showProjectForm', {
                is: true,
                then: Yup.string().required('Proje açıklaması zorunludur.'),
            }),
        }),
        onSubmit: values => {
            navigation.navigate('DashBoard')
            Alert.alert('Kayıt İşlemi Başarılı');
            console.log(formik.initialValues)
        },
    });
    const handleFilePick = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });

            if (result[0].name && result[0].name.endsWith('.pdf')) {
                formik.setFieldValue('cv', result[0].uri);
                setCvFileName(result[0].name);
                await AsyncStorage.setItem('cvFileName', result[0].name);

            } else {
                Alert.alert('Hata', 'Lütfen PDF dosyası seçin.');
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                Alert.alert('Hata', 'Dosya seçerken bir hata oluştu.');
            }
        }
    };

    const toggleProjectForm = () => {
        setShowProjectForm(!showProjectForm);
        if (!showProjectForm) {
            resetProjectFields();
        }
    };
    const addProjectField = () => {
        const newId = projectFields.length + 1;
        setProjectFields([...projectFields, { id: newId, name: '', description: '' }]);
    };
    const removeProjectField = id => {
        const updatedFields = projectFields.filter(field => field.id !== id);
        setProjectFields(updatedFields);
    };
    const handleProjectNameChange = (id, text) => {
        const updatedFields = projectFields.map(field =>
            field.id === id ? { ...field, name: text } : field
        );
        setProjectFields(updatedFields);
    };
    const handleProjectDescriptionChange = (id, text) => {
        const updatedFields = projectFields.map(field =>
            field.id === id ? { ...field, description: text } : field
        );
        setProjectFields(updatedFields);
    };
    const resetProjectFields = () => {
        formik.setFieldValue('projectName', '');
        formik.setFieldValue('projectDescription', '');
    };
    return (
        <View style={{ flex: 1, justifyContent: 'center', marginLeft: 5 }}>
            <TouchableOpacity onPress={handleFilePick}>
                <Text style={{ marginTop: 10, marginVertical: 10, color: "blue" }}>Lütfen Cv Seçiniz</Text>
            </TouchableOpacity>

            {formik.errors.cv && <Text style={{ color: 'red' }}>{formik.errors.cv}</Text>}

            {cvFileName ? (
                <Text style={{ marginTop: 10, marginVertical: 10, fontWeight: "bold" }}>Yüklenen CV: {cvFileName}</Text>
            ) : (
                null
            )}

            <TouchableOpacity onPress={toggleProjectForm}>
                <Text style={{ marginTop: 10, marginVertical: 10, color: "blue" }}>{showProjectForm ? 'İptal Et' : ' Proje Ekle'}</Text>
            </TouchableOpacity>

            {/* Proje Formu */}
            {showProjectForm && (
                <View style={{ marginTop: 20 }}>
                    {projectFields.map(field => (
                        <View key={field.id} style={{ marginBottom: 10 }}>
                            <TextInput
                                style={styles.input}
                                placeholder={`Proje Adı Giriniz`}
                                onChangeText={text => handleProjectNameChange(field.id, text)}
                                onBlur={() => formik.setFieldTouched(`projectName${field.id}`)}
                                value={field.name}
                            />
                            {formik.touched[`projectName${field.id}`] && formik.errors.projectName && (
                                <Text style={{ color: 'red' }}>{formik.errors.projectName}</Text>
                            )}

                            <TextInput
                                style={styles.input}
                                placeholder={`Proje Açıklaması Giriniz`}
                                onChangeText={text => handleProjectDescriptionChange(field.id, text)}
                                onBlur={() => formik.setFieldTouched(`projectDescription${field.id}`)}
                                value={field.description}
                            />
                            {formik.touched[`projectDescription${field.id}`] &&
                                formik.errors.projectDescription && (
                                    <Text style={{ color: 'red' }}>{formik.errors.projectDescription}</Text>
                                )}
                            <Button title="Sil" onPress={() => removeProjectField(field.id)} />
                        </View>
                    ))}

                    <TouchableOpacity onPress={addProjectField}>
                        <Text style={{ marginTop: 10, marginVertical: 10, color: "blue" }} >Proje Alanı Ekle</Text>
                    </TouchableOpacity>

                </View>
            )}

            <TouchableOpacity onPress={formik.handleSubmit}>
                <Text style={{ marginTop: 10, marginVertical: 10, color: "blue", alignItems: 'center' }}>Kaydet</Text>
            </TouchableOpacity>
        </View>
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
        width: "100%",
        marginTop: 10
    },
    errorText: {
        color: 'red',
    },
});
export default App;