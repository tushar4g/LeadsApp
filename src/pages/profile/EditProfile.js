import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setUserName, updateEmail, updateAvatar, updatePhone } from '../../redux/slices/userSlice'
import Colors from '../../style/Colors'

const EditProfile = ({ navigation }) => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const [name, setNameState] = useState(user.name)
  const [email, setEmailState] = useState(user.email)
  const [avatar, setAvatarState] = useState(user.avatar)
  const [phone, setPhoneState] = useState(user.phone)

  const handleSave = () => {
    dispatch(setUserName(name))
    dispatch(updateEmail(email))
    dispatch(updateAvatar(avatar))
    dispatch(updatePhone(phone))
    if (navigation) navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setNameState}
        placeholder="Enter your name"
        placeholderTextColor={Colors.gray}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmailState}
        placeholder="Enter your email"
        keyboardType="email-address"
        placeholderTextColor={Colors.gray}
      />
      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhoneState}
        placeholder="Enter your mobile number"
        keyboardType="phone-pad"
        placeholderTextColor={Colors.gray}
      />
      <Text style={styles.label}>Avatar URL</Text>
      <TextInput
        style={styles.input}
        value={avatar}
        onChangeText={setAvatarState}
        placeholder="Paste avatar image URL"
        placeholderTextColor={Colors.gray}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    color: Colors.primary,
    alignSelf: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignSelf: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: '#eee',
  },
  label: {
    fontSize: 15,
    color: Colors.gray,
    marginBottom: 6,
    marginTop: 12,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 4,
    color: Colors.textPrimary,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 24,
    marginTop: 28,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
})

export default EditProfile