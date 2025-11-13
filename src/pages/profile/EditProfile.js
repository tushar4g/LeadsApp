import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {
  setUserName,
  updateEmail,
  updateAvatar,
  updateDesignation,
  updateHospitalName,
  updatePhone,
} from '../../redux/slices/userSlice'
import Colors from '../../style/Colors'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import PickImageComponent from '../../components/PickImageComponent'
import CustomDropDown from '../../components/CustomDropDown'

const hospitalListOptions = [
  // 🏥 Raipur
  { label: 'DKS Hospital Raipur', value: 'dks' },
  { label: 'Ramkrishna CARE Hospitals', value: 'ramkrishna_care' },
  { label: 'Balco Medical Centre', value: 'balco' },
  { label: 'AIIMS Raipur', value: 'aiims_raipur' },
  { label: 'MMI Narayana Multispeciality Hospital', value: 'mmi_narayana' },
  // 🏥 Bhilai
  { label: 'JLN Hospital & Research Centre', value: 'jln_bhilai' },
  { label: 'Sai Baba Hospital Bhilai', value: 'sai_baba_bhilai' },
  // 🏥 Durg
  { label: 'Anand Hospital Durg', value: 'anand_durg' },
  { label: 'Suyash Hospital Durg', value: 'suyash_durg' },
  // 🏥 Bilaspur
  { label: 'Apollo Hospitals Bilaspur', value: 'apollo_bilaspur' },
  { label: 'CIMS Hospital Bilaspur', value: 'cims_bilaspur' },
  // 🏥 Korba
  { label: 'Balco Hospital Korba', value: 'balco_korba' },
  { label: 'Chirayu Hospital Korba', value: 'chirayu_korba' },
  // 🏥 Jagdalpur
  { label: 'Maharani Hospital Jagdalpur', value: 'maharani_jagdalpur' },
  { label: 'District Hospital Jagdalpur', value: 'district_jagdalpur' },
  // 🏥 Rajnandgaon
  { label: 'District Hospital Rajnandgaon', value: 'district_rajnandgaon' },
  { label: 'Nirmal Hospital Rajnandgaon', value: 'nirmal_rajnandgaon' },
];

const EditProfile = ({ navigation }) => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const [name, setNameState] = useState(user.name)
  const [email, setEmailState] = useState(user.email)
  const [phone, setPhoneState] = useState(user.phone)
  const [designation, setDesignationState] = useState(user.designation)
  const [hospitalName, setHospitalNameState] = useState(user.hospitalName)
  const [avatarUri, setAvatarUri] = useState(user.avatar)

  const handlePickImage = async () => {
    try {
      const asset = await PickImageComponent()
      if (asset) {
        setAvatarUri(asset.uri)
      }
    } catch (err) {
      Alert.alert('Image Picker Error', 'Failed to pick image.')
    }
  }

  const handleSave = () => {
    dispatch(setUserName(name))
    dispatch(updateEmail(email))
    dispatch(updatePhone(phone))
    dispatch(updateDesignation(designation))
    dispatch(updateHospitalName(hospitalName))
    dispatch(updateAvatar(avatarUri))
    if (navigation) navigation.goBack()
  }

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.back}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={responsiveFontSize(2.2)}
            color={Colors.white}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={handlePickImage}
        >
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <View style={styles.editIcon}>
            <MaterialCommunityIcons
              name="camera-plus"
              size={responsiveFontSize(2)}
              color={Colors.white}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.form}>
          <CustomInput
            label="Name"
            value={name}
            onChangeText={setNameState}
            icon="person"
          />
          <CustomInput
            label="Mobile Number"
            value={phone}
            onChangeText={setPhoneState}
            keyboardType="phone-pad"
            icon="phone"
          />
          <CustomInput
            label="Email"
            value={email}
            onChangeText={setEmailState}
            keyboardType="email-address"
            icon="email"
          />
          <CustomInput
            label="Designation"
            value={designation}
            onChangeText={setDesignationState}
            icon="badge"
            editable={false}
          />
          <CustomDropDown
            uprLabel="Hospital Name"
            value={hospitalName}
            setValue={setHospitalNameState}
            data={hospitalListOptions}
            iconName="local-hospital"
          />
        
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton title="Save Changes" onPress={handleSave} />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    height: responsiveHeight(7),
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(3),
  },
  back: { width: responsiveWidth(10), justifyContent: 'center' },
  title: {
    flex: 1,
    textAlign: 'center',
    color: Colors.white,
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
  },
  container: {
    padding: responsiveWidth(5),
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: responsiveHeight(3),
  },
  avatar: {
    width: responsiveWidth(28),
    height: responsiveWidth(28),
    borderRadius: responsiveWidth(14),
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    padding: responsiveWidth(2),
    borderRadius: responsiveWidth(4),
    borderWidth: 2,
    borderColor: Colors.white,
  },
  form: {
    gap: responsiveHeight(1.5),
  },
  buttonContainer: {
    marginTop: responsiveHeight(4),
  },
})

export default EditProfile