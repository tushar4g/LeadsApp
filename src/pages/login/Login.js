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
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import Colors from '../../style/Colors'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MOBILE_RE = /^\d{10}$/

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState({ username: '', password: '' })

  useEffect(() => {
    // try to prefill saved credentials (remember me)
    ;(async () => {
      try {
        const saved = await AsyncStorage.getItem('@credentials')
        if (saved) {
          const { username: u, password: p } = JSON.parse(saved)
          setUsername(u)
          setPassword(p)
          setRemember(true)
        }
      } catch (e) {
        // ignore
      }
    })()
  }, [])

  const validate = () => {
    const e = { username: '', password: '' }
    const v = username?.trim()
    if (!v) e.username = 'Email or mobile is required'
    else if (!EMAIL_RE.test(v) && !MOBILE_RE.test(v)) e.username = 'Enter valid email or 10-digit mobile'

    if (!password || password.length < 4) e.password = 'Password is required (min 4 chars)'
    setErrors(e)
    return !e.username && !e.password
  }

  const handleLogin = async () => {
    // if (!validate()) return
    setLoading(true)
    try {
      // replace with real API_BASE
    //   const API_BASE = 'https://your-api.example.com'
    //   const payload = { username: username.trim(), password }
    //   const res = await fetch(`${API_BASE}/login`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(payload),
    //   })

    //   if (!res.ok) {
    //     const data = await res.json().catch(() => ({}))
    //     throw new Error(data?.message || 'Invalid credentials')
    //   }

    //   const data = await res.json()
    //   const token = data?.token || data?.accessToken
    //   if (!token) throw new Error('Invalid response from server')

    //   await AsyncStorage.setItem('@token', token)

    //   if (remember) {
    //     await AsyncStorage.setItem('@credentials', JSON.stringify({ username: username.trim(), password }))
    //   } else {
    //     await AsyncStorage.removeItem('@credentials')
    //   }

      // navigate to main/dashboard
      navigation?.reset?.({
        index: 0,
        routes: [{ name: 'Main' /* or 'Home' depending on your navigator */ }],
      })
    } catch (err) {
      Alert.alert('Login failed', err?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.top}>
            {/* placeholder logo - replace with Image source if available */}
            <View style={styles.logoWrap}>
              <MaterialIcons name="local-hospital" size={responsiveFontSize(6)} color={Colors.primary} />
            </View>
            <Text style={styles.welcome}>Welcome</Text>
            <Text style={styles.subtitle}>Login to continue managing your healthcare leads.</Text>
          </View>

          <View style={styles.card}>
            <CustomInput
              label="Email or Mobile Number"
              value={username}
              onChangeText={(t) => {
                setUsername(t)
                if (errors.username) setErrors((s) => ({ ...s, username: '' }))
              }}
              placeholder="Enter email or mobile number"
              icon="mail"
              keyboardType="default"
              maxLength={10}
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

            <View style={styles.registerRow}>
              <Text style={styles.regText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation?.navigate('Register')}>
                <Text style={styles.regLink}> Register</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: responsiveHeight(6) }} />
        </ScrollView>
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
    elevation: 3,
    marginBottom: responsiveHeight(1.5),
  },
  welcome: { fontSize: responsiveFontSize(2.2), fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: responsiveFontSize(1.4), color: Colors.textSecondary, marginTop: responsiveHeight(0.5), textAlign: 'center', paddingHorizontal: responsiveWidth(2) },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: responsiveWidth(4),
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
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
  forgot: { color: Colors.primary, fontWeight: '700' },

  err: { color: Colors.secondary, marginTop: responsiveHeight(0.4), fontSize: responsiveFontSize(1.1) },

  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: responsiveHeight(2) },
  regText: { color: Colors.textSecondary },
  regLink: { color: Colors.primary, fontWeight: '800' },
})