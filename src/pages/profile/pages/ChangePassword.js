import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  ToastAndroid,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CustomInput from '../../../components/CustomInput'
import CustomButton from '../../../components/CustomButton'
import Colors from '../../../style/Colors'

const ChangePassword = ({ navigation }) => {
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')

  const [errCurrent, setErrCurrent] = useState('')
  const [errNew, setErrNew] = useState('')
  const [errConfirm, setErrConfirm] = useState('')

  const [loading, setLoading] = useState(false)

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const resetErrors = () => {
    setErrCurrent('')
    setErrNew('')
    setErrConfirm('')
  }

  const validate = () => {
    resetErrors()
    let ok = true
    if (!currentPwd.trim()) {
      setErrCurrent('Current password is required.')
      ok = false
    }
    if (!newPwd) {
      setErrNew('New password is required.')
      ok = false
    } else if (newPwd.length < 8) {
      setErrNew('Use at least 8 characters.')
      ok = false
    }
    if (!confirmPwd) {
      setErrConfirm('Please confirm new password.')
      ok = false
    } else if (confirmPwd !== newPwd) {
      setErrConfirm('Passwords do not match.')
      ok = false
    }
    return ok
  }

  const changePasswordApi = async (old_password, new_password) => {
    // Replace URL with your backend endpoint
    const token = await AsyncStorage.getItem('token')
    const url = 'https://api.example.com/auth/change-password'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ old_password, new_password }),
    })
    const json = await resp.json().catch(() => null)
    if (!resp.ok) {
      throw new Error(json?.message || 'Unable to update password')
    }
    return json
  }

  const onUpdate = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await changePasswordApi(currentPwd, newPwd)
      setLoading(false)
      // success feedback
      if (Platform.OS === 'android') {
        ToastAndroid.show('Password updated successfully', ToastAndroid.SHORT)
      } else {
        Alert.alert('Success', 'Password updated successfully')
      }
      // clear fields
      setCurrentPwd('')
      setNewPwd('')
      setConfirmPwd('')
      navigation?.goBack()
    } catch (err) {
      setLoading(false)
      Alert.alert('Error', err?.message || 'Failed to change password')
    }
  }

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.back}>
          <MaterialCommunityIcons name="arrow-left" size={responsiveFontSize(2.2)} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Change Password</Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Update your account password</Text>

          <CustomInput
            label="Current Password"
            value={currentPwd}
            onChangeText={(t) => setCurrentPwd(t)}
            placeholder="Enter your current password"
            icon="lock"
          />
          {errCurrent ? <Text style={styles.errorText}>{errCurrent}</Text> : null}
          {/* <View style={styles.toggleRow}>
            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
              <MaterialCommunityIcons name={showCurrent ? 'eye-off' : 'eye'} size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View> */}

          <CustomInput
            label="New Password"
            value={newPwd}
            onChangeText={(t) => setNewPwd(t)}
            placeholder="Enter new password"
            isPassword={!showNew}
            icon="lock"
          />
          {errNew ? <Text style={styles.errorText}>{errNew}</Text> : null}
          {/* <View style={styles.toggleRow}>
            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
              <MaterialCommunityIcons name={showNew ? 'eye-off' : 'eye'} size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View> */}

          <CustomInput
            label="Confirm New Password"
            value={confirmPwd}
            onChangeText={(t) => setConfirmPwd(t)}
            placeholder="Re-enter new password"
            isPassword={!showConfirm}
            icon="task-alt"
          />
          {errConfirm ? <Text style={styles.errorText}>{errConfirm}</Text> : null}
          {/* <View style={styles.toggleRow}>
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <MaterialCommunityIcons name={showConfirm ? 'eye-off' : 'eye'} size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View> */}

          <Text style={styles.hint}>Use at least 8 characters.</Text>

          <View style={styles.actions}>
            <CustomButton title={loading ? 'Updating...' : 'Update Password'} onPress={onUpdate} isLoading={loading} />
          </View>

          {/* <TouchableOpacity style={styles.cancelWrap} onPress={() => navigation?.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity> */}
        </View>

        <View style={{ height: responsiveHeight(8) }} />
      </ScrollView>

      {/* {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      )} */}
    </View>
  )
}

export default ChangePassword

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
  title: { flex: 1, textAlign: 'center', color: Colors.white, fontSize: responsiveFontSize(2), fontWeight: '700' },

  container: { padding: responsiveWidth(4), paddingBottom: responsiveHeight(6) },
  card: {
    backgroundColor: Colors.white,
    borderRadius: responsiveWidth(2),
    padding: responsiveWidth(4),
    elevation: 1,
  },
  cardTitle: { fontSize: responsiveFontSize(1.6), fontWeight: '700', color: Colors.textPrimary, marginBottom: responsiveHeight(1) },

  errorText: { color: Colors.secondary, marginTop: responsiveHeight(0.4), marginBottom: responsiveHeight(0.4) },

  toggleRow: { position: 'absolute', right: responsiveWidth(8), top: responsiveHeight(7.4) }, // lightweight placement for eye icon
  hint: { color: Colors.textSecondary, fontSize: responsiveFontSize(1.2), marginTop: responsiveHeight(1) },

  actions: { marginTop: responsiveHeight(2) },
  cancelWrap: { marginTop: responsiveHeight(1.2), alignItems: 'center' },
  cancelText: { color: Colors.primary, fontWeight: '700' },

  loadingOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.6)' },
})