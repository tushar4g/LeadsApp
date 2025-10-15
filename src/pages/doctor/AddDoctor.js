import { View, ScrollView, Alert, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import MyHeader from '../../components/MyHeader'
import CustomInput from '../../components/CustomInput'
import CustomDropDown from '../../components/CustomDropDown'
import CustomButton from '../../components/CustomButton'
// import your doctorSlice or relevant redux slice
import { addDoctor } from '../../redux/slices/doctorSlice'

const specialityOptions = [
  { label: 'Cardiologist', value: 'cardiologist' },
  { label: 'Dermatologist', value: 'dermatologist' },
  { label: 'Neurologist', value: 'neurologist' },
  { label: 'Pediatrician', value: 'pediatrician' },
  { label: 'General Physician', value: 'general' },
  // Add more as needed
]

const genderData = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
]

const AddDoctor = ({ navigation }) => {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [experience, setExperience] = useState('')
  const [speciality, setSpeciality] = useState('')
  const [address, setAddress] = useState('')
  const dispatch = useDispatch()

  const validatation = () => {
    // Name validation
    if (!name.trim()) {
      showToast('Name is required');
      return false;
    }
    // Mobile validation (basic: 10-15 digits)
    if (!/^\d{10,15}$/.test(mobile)) {
      showToast('Enter a valid mobile number');
      return false;
    }
    // Email validation (basic)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Enter a valid email address');
      return false;
    }
    // Age validation
    if (!age.trim()) {
      showToast('Age is required');
      return false;
    }
    // Gender validation
    if (!gender) {
      showToast('Please select a gender');
      return false;
    }
    // Speciality validation
    if (!speciality) {
      showToast('Please select a speciality');
      return false;
    }
    // Experience validation
    if (!experience.trim()) {
      showToast('Experience is required');
      return false;
    }
    // Address validation
    if (!address.trim()) {
      showToast('Address is required');
      return false;
    }
    return true;
  };

  const handleAddDoctor = () => {
    if (!validatation()) return;
    dispatch(addDoctor({ name, mobile, email, speciality, address }))
    navigation.goBack()
  }

  const showToast = (msg)=>{
    ToastAndroid.showWithGravity(msg, ToastAndroid.TOP, ToastAndroid.SHORT)
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <MyHeader title={'Add Doctor'} onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 18 }}>
        <CustomInput
          label="Name"
          value={name}
          onChangeText={setName}
          icon="person"
          placeholder="Enter doctor's name"
        />
        <CustomInput
          label="Mobile"
          value={mobile}
          onChangeText={setMobile}
          icon="phone"
          keyboardType="phone-pad"
          placeholder="Enter mobile number"
          maxLength={10}
        />
        <CustomInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          icon="email"
          keyboardType="email-address"
          placeholder="Enter email"
        />
        <CustomInput
          label="Age"
          value={age}
          onChangeText={setAge}
          icon="calendar-month"
          keyboardType="numeric"
          placeholder="Enter age"
        />
        <CustomDropDown
          uprLabel="Gender"
          value={gender}
          setValue={setGender}
          data={genderData}
          iconName="male"
          placeholder="Select gender"
        />
        <CustomDropDown
          uprLabel="Speciality"
          value={speciality}
          setValue={setSpeciality}
          data={specialityOptions}
          iconName="medical-services"
          placeholder="Select speciality"
        />
        <CustomInput
          label="Experience"
          value={experience}
          onChangeText={setExperience}
          icon='medical-services'
          placeholder='Enter Experience'
        />  
        <CustomInput
          label="Address"
          value={address}
          onChangeText={setAddress}
          icon="location-on"
          placeholder="Enter address"
        />
        <CustomButton
          title="Add Doctor"
          onPress={handleAddDoctor}
        />
      </ScrollView>
    </View>
  )
}

export default AddDoctor