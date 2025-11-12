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
  updatePhone,
} from '../../redux/slices/userSlice'
import Colors from '../../style/Colors'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import PickImageComponent from '../../components/PickImageComponent'

const EditProfile = ({ navigation }) => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const [name, setNameState] = useState(user.name)
  const [email, setEmailState] = useState(user.email)
  const [phone, setPhoneState] = useState(user.phone)
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
            label="Email"
            value={email}
            onChangeText={setEmailState}
            keyboardType="email-address"
            icon="email"
          />
          <CustomInput
            label="Mobile Number"
            value={phone}
            onChangeText={setPhoneState}
            keyboardType="phone-pad"
            icon="phone"
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