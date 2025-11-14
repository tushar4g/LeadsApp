import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import Colors from '../../style/Colors'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import DeviceInfo from 'react-native-device-info'
import BaseURL from '../../assets/baseUrl/BaseURL'
import { useFocusEffect } from '@react-navigation/native';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MOBILE_RE = /^\d{10}$/

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState({ username: '', password: '' })
  const [deviceModel, setDeviceModel] = useState('')
  const [osVersion, setOsVersion] = useState('')
  const [appVersion, setAppVersion] = useState('')

  // useEffect(() => {
  //   // try to prefill saved credentials (remember me)
  //   (async () => {
  //     try {
  //       const saved = await AsyncStorage.getItem('@credentials')
  //       if (saved) {
  //         const { username: u, password: p } = JSON.parse(saved)
  //         setUsername(u)
  //         setPassword(p)
  //         setRemember(true)
  //       }
  //     } catch (e) {
  //       // ignore
  //     }
  //     try {
  //       setDeviceModel(DeviceInfo.getModel())
  //       setOsVersion(DeviceInfo.getSystemVersion())
  //       setAppVersion(DeviceInfo.getVersion())
  //     } catch (e) {
  //       // ignore errors during device info retrieval
  //       console.warn("Failed to get device info:", e); // Optional: log the error for debugging
  //     }
  //   })()
  // }, [])

  const validation = () => {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username || !password) {
      showToast('Please fill all fields');
      return false;
    }
     if (!emailRegex.test(username)) {
    showToast('Please enter a valid email address');
    return false;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters');
      return false;
    }
    return true;
  }

  const checkForToken = async () => {
    try {
      // setLoading(true)
      setAppVersion(DeviceInfo.getVersion())
      const token = await AsyncStorage.getItem('@token')
      if (token) {
        navigation?.reset?.({
          index: 0,
          routes: [{ name: 'Main' }],
        })
      }
    } catch (e) {
      // ignore
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      checkForToken()
    }, [checkForToken])
  )

  const handleLogin = async () => {
    if (!validation()) return
    try {
      setLoading(true)
      const baseUrl = await BaseURL.uri;
      const formData = new FormData();
      formData.append('email', username);
      formData.append('password', password);
      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        console.log(result);
        await AsyncStorage.setItem('@token', result.data.token);
        navigation?.reset?.({
          index: 0,
          routes: [{ name: 'Main' }],
        })
      } else {
        console.log('else',result);
        showToast(result.error || 'Something went wrong');
      }
    } catch (err) {
      console.log('Error during login:', err);
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg) => {
    ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.CENTER);
  }

  return (
    <View style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={[Colors.lightPrimary, Colors.white]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.top}>
            <View style={styles.logoWrap}>
              <Image source={require('../../assets/images/img1.jpg')} style={styles.logo} />
            </View>
            <Text style={styles.welcome}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Login to continue managing your healthcare leads.</Text>
          </View>

          <View style={styles.formContainer}>
            <CustomInput
              label="Email or Mobile Number"
              value={username}
              onChangeText={(t) => {
                setUsername(t)
                if (errors.username) setErrors((s) => ({ ...s, username: '' }))
              }}
              placeholder="Enter email or mobile number"
              icon="mail"
              keyboardType="email-address"
            />
            {errors.username ? <Text style={styles.err}>{errors.username}</Text> : null}

            <View style={{ height: responsiveHeight(1.5) }} />

            <CustomInput
              label="Password"
              value={password}
              onChangeText={(t) => {
                setPassword(t)
                if (errors.password) setErrors((s) => ({ ...s, password: '' }))
              }}
              placeholder="Enter password"
              icon="lock"
              isPassword={true}
            />
            {errors.password ? <Text style={styles.err}>{errors.password}</Text> : null}

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.remember}
                onPress={() => setRemember((v) => !v)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, remember ? styles.checkboxOn : null]}>
                  {remember ? <MaterialIcons name="check" size={responsiveFontSize(2)} color={Colors.white} /> : null}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation?.navigate('ForgotPassword')}>
                <Text style={styles.forgot}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: responsiveHeight(2) }}>
              <CustomButton title="Login" onPress={handleLogin} isLoading={loading} />
            </View>

            {/* <View style={styles.registerRow}>
              <Text style={styles.regText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation?.navigate('Register')}>
                <Text style={styles.regLink}> Register</Text>
              </TouchableOpacity>
            </View> */}
          </View>

          <View style={styles.deviceInfo}>
            {/* <Text style={styles.deviceInfoText}>Device: {deviceModel} (Android {osVersion})</Text> */}
            <Text style={styles.deviceInfoText}>App Version: {appVersion}</Text>
          </View>

          <View style={{ height: responsiveHeight(6) }} />
        </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.lightPrimary },
  container: {
    flexGrow: 1,
    padding: responsiveWidth(5),
    justifyContent: 'center',
  },
  top: { alignItems: 'center', marginBottom: responsiveHeight(2) },
  logoWrap: {
    width: responsiveWidth(24),
    height: responsiveWidth(24),
    borderRadius: responsiveWidth(12),
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    marginBottom: responsiveHeight(1.5),
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  logo: {
    width: responsiveWidth(18),
    height: responsiveWidth(18),
    resizeMode: 'contain',
  },
  welcome: { fontSize: responsiveFontSize(2.8), fontWeight: 'bold', color: Colors.textPrimary },
  subtitle: { fontSize: responsiveFontSize(1.6), color: Colors.textSecondary, marginTop: responsiveHeight(0.8), textAlign: 'center', paddingHorizontal: responsiveWidth(4) },

  formContainer: {
    marginTop: responsiveHeight(3),
    // gap: responsiveHeight(1.5)
  },

  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: responsiveHeight(1) },
  remember: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: responsiveWidth(5.5),
    height: responsiveWidth(5.5),
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: responsiveWidth(2),
  },
  checkboxOn: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  rememberText: { color: Colors.textSecondary },
  forgot: { color: Colors.primary, fontWeight: '700', fontSize: responsiveFontSize(1.5) },

  err: { color: Colors.secondary, marginTop: responsiveHeight(0.5), fontSize: responsiveFontSize(1.3) },

  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: responsiveHeight(2) },
  regText: { color: Colors.textSecondary, fontSize: responsiveFontSize(1.5) },
  regLink: { color: Colors.primary, fontWeight: '800', fontSize: responsiveFontSize(1.5) },

  deviceInfo: {
    alignItems: 'center',
    marginTop: responsiveHeight(3),
  },
  deviceInfoText: { fontSize: responsiveFontSize(1.2), color: Colors.textTertiary, marginBottom: responsiveHeight(0.5) },
})