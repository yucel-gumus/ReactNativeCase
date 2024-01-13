import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Button, ScrollView, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Formik, useFormikContext } from 'formik';
import SelectDropdown from 'react-native-select-dropdown'
import * as Yup from 'yup';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import CheckBox from '@react-native-community/checkbox';

const RegistrationSchema = Yup.object().shape({
  uniqueID: Yup
    .string()
    .matches(/^[0-9]{11}$/, 'Geçerli bir TC kimlik numarası giriniz')
    .required('Bu alan zorunludur'),
  phoneNumber: Yup
    .string()
    .matches(/^[0-9]{10}$/, 'Geçerli bir telefon numarası giriniz')
    .required('Bu alan zorunludur'),
  fullName: Yup.string()
    .min(3, 'Ad ve soyad en az 3 karakter olmalıdır.')
    .required('Ad soyad boş bırakılamaz'),
  birthDate: Yup.date().required('Doğum tarihi zorunludur'),
  gender: Yup.string().notOneOf(['Seçiniz'], 'Cinsiyet seçimi zorunludur'),
  kvkkCheck: Yup.boolean().isTrue('KVKK Onayı zorunludur.').required(),

});
const MyForm = (data) => {
  const { handleChange, handleBlur, handleSubmit, setFieldValue, setFieldError, values, touched, errors } = useFormikContext();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [alldata, setAlldata] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [date, setDate] = useState(null)

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    setFieldValue('birthDate', date);
    hideDatePicker();
    console.log(date)
    setDate(date)
  };
  const handleCheckboxToggle = () => {
    setIsChecked(!isChecked);
    setFieldValue('kvkkCheck', !isChecked)
  };
  const handleSubmitKvkk = () => {
    setModalVisible(true);
  };
  const kvkkText = `
  KVKK Metni Buraya Gelecek.
  Bu metni okuyup kabul etmeniz gerekmektedir.
`;
  const handleModalClose = () => {
    setModalVisible(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // API endpoint
        const apiUrl = "https://restcountries.com/v3.1/all";

        // GET isteği yap
        const response = await fetch(apiUrl);

        // JSON formatında veriyi al
        const data = await response.json();
        setAlldata(data);

        // Veriyi işleme fonksiyonunu çağır
        processData(data);
      } catch (error) {
        console.error("API isteği sırasında bir hata oluştu:", error);
      }
    };

    // fetchData fonksiyonunu çağır
    fetchData();
  }, []);

  const processData = (data) => {
    const names = data.map((item) => item.name && item.translations.tur.common);
    const sortedCountries = names.filter((name) => name).sort();
    setCountries(sortedCountries);
  };
  const handleCountryChange = async (event) => {
    setSelectedCountry(event);
    const datasa = event;
    const filteredData = alldata
      .filter((item) => item.translations.tur.common === datasa)
      .map((item) => item.name.common);

    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/cities",
        {
          method: "POST",
          body: JSON.stringify({ country: filteredData[0] }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = await response.json();
      setCities(responseData.data)
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };
  const handleCityChange = (value) => {
    setSelectedCity(value);
  };


  return (
    <View style={styles.container}>
      {/* Ad Soyad Alanı */}
      <TextInput
        style={styles.input}
        onChangeText={handleChange('fullName')}
        onBlur={handleBlur('fullName')}
        value={values.fullName}
        placeholder="Adınızı ve Soyadınızı Giriniz."
      />

      {errors.fullName && touched.fullName ? (
        <Text style={{ color: 'red' }}>{errors.fullName}</Text>
      ) : null}
      {/* TC numarası Alanı */}
      <TextInput
        style={styles.input}
        onChangeText={handleChange('uniqueID')}
        onBlur={handleBlur('uniqueID')}
        value={values.uniqueID}
        placeholder="Lütfen 11 haneli TC kimlik numaranızı giriniz."
      />
      {errors.uniqueID && touched.uniqueID ? (
        <Text style={{ color: 'red' }}>{errors.uniqueID}</Text>
      ) : null}

      {/* Telefon Alanı */}
      <TextInput
        style={styles.input}
        onChangeText={handleChange('phoneNumber')}
        onBlur={handleBlur('phoneNumber')}
        value={values.phoneNumber}
        placeholder="Lütfen Telefon Numaranızı başında 0 olmadan giriniz"
      />
      {errors.phoneNumber && touched.phoneNumber ? (
        <Text style={{ color: 'red' }}>{errors.phoneNumber}</Text>
      ) : null}
      {/* Doğum tarihi Alanı */}
      <TextInput
        style={styles.input}
        value={date ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}` : ''}
        placeholder="Doğum Tarihinizi Seçiniz"
        editable={false}
        onTouchStart={showDatePicker}
        selectTextOnFocus={false}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
        confirmTextIOS='Seç'
        cancelTextIOS='Kapat'
      />

      {errors.birthDate && touched.birthDate ? (
        <Text style={{ color: 'red' }}>{errors.birthDate}</Text>
      ) : null}

      <Text>Cinsiyet</Text>
      <SelectDropdown
        data={['Seçiniz', 'Erkek', 'Kadın']}
        onSelect={(selectedItem, index) => {
          setFieldValue('gender', selectedItem);
        }}
        defaultButtonText="Cinsiyetinizi Seçiniz"
      />
      {errors.gender && touched.gender ? (
        <Text style={{ color: 'red' }}>{errors.gender}</Text>
      ) : null}

      {/* Ülke ve İl  Alanı */}
      <View style={{ marginVertical: 10 }}>
        <Text>Ülke</Text>
        <SelectDropdown
          data={countries}
          onSelect={(selectedItem,) => {
            handleCountryChange(selectedItem);
          }}
          buttonTextAfterSelection={(selectedItem) => {
            return selectedItem;
          }}
          rowTextForSelection={(item) => {
            return item;
          }}
          defaultButtonText="Lütfen Ülkenizi Seçiniz"
          menuStyle={{ width: "300px" }}

        />
        <Text>İl</Text>
        <SelectDropdown
          data={cities}
          onSelect={(selectedItem,) => {
            handleCityChange(selectedItem);
          }}
          buttonTextAfterSelection={(selectedItem) => {
            return selectedItem;
          }}
          rowTextForSelection={(item) => {
            return item;
          }}
          defaultButtonText="Lütfen İlinizi Seçiniz"
          menuStyle={{ width: "300px" }}

        />
      </View>
      {/* Kvkk Alanı */}
      <Text>KVKK Onayı (Kullanıcı Sözleşmesi ve Gizlilik Politikası)</Text>
      <Button
        style={{ marginLeft: 10, marginTop: 10 }}
        title="Oku"
        onPress={() => {
          handleSubmitKvkk();
        }}
      />
      {errors.kvkkCheck && touched.kvkkCheck ? (
        <Text style={{ color: 'red' }}>{errors.kvkkCheck}</Text>
      ) : null}

      {/*  Alanı */}
      <Button title="Devam Et" onPress={handleSubmit} disabled={values.gender === 'Seçiniz'} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text>{kvkkText}</Text>
            <View style={{ alignItems: 'center' }}>
              <Text>KVKK metnini okudum onaylıyorum</Text>
              <CheckBox
                style={{ marginTop: 10 }}
                value={isChecked}
                onValueChange={handleCheckboxToggle}
              />
            </View>
            <TouchableOpacity onPress={handleModalClose}>
              <Text style={{ color: 'blue', marginTop: 10 }}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Registration = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);

  const handleImagePick = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const firstAsset = response.assets[0];
        setPhoto(firstAsset.uri);
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <View style={{ alignItems: 'center' }}>
        <Image
          source={photo ? { uri: photo } : require('../public/userProfil.jpeg')}
          style={{ width: 150, height: 150, borderRadius: 75 }}
        />
        <Button title="Profil Fotoğrafı Seçiniz" onPress={handleImagePick} />
      </View>
      <Formik
        initialValues={{
          uniqueID: '',
          phoneNumber: '',
          fullName: '',
          birthDate: null,
          gender: null,
          kvkkCheck: false
        }}
        validationSchema={RegistrationSchema}
        onSubmit={(values) => {
          console.log('Form Values:', values);
          navigation.navigate('WorkAndOccupation');
        }}
      >
        <MyForm />
      </Formik>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#00dfff',
    padding: 8,
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
  },
});
export default Registration;
