import React, { useEffect, useRef, useState } from 'react'
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import Colors from '../../style/Colors'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'

const MOBILE_RE = /^\d{10}$/

const ForgotPassword = ({ navigation }) => {
  const [mobile, setMobile] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const anim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 420, useNativeDriver: true }).start()
  }, [])

  const validate = () => {
    const v = (mobile || '').trim()
    if (!v) {
      setError('Mobile number is required')
      return false
    }
    if (!MOBILE_RE.test(v)) {
      setError('Enter a valid 10‑digit mobile number')
      return false
    }
    setError('')
    return true
  }

  const handleSend = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      // const API_BASE = 'https://your-api.example.com' // replace with real API
      // const payload = { mobile: mobile.trim() }
      // const res = await fetch(`${API_BASE}/forgotPassword`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // })

      // if (!res.ok) {
      //   const err = await res.json().catch(() => ({}))
      //   throw new Error(err?.message || 'Unable to send reset link')
      // }

      // await res.json().catch(() => ({}))
      // Alert.alert('Success', 'Password reset link / OTP sent successfully!')
      navigation?.navigate('OTPVerification', { mobile: mobile.trim() })
    } catch (err) {
      Alert.alert('Error', err?.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  const cardStyle = {
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
    opacity: anim,
  }

  return (
    <View style={styles.safe}>
      <LinearGradient colors={['#E3F2FD', '#FFFFFF']} style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <View style={styles.logoWrap}>
                <MaterialIcons name="local-hospital" size={responsiveFontSize(5.2)} color={Colors.primary} />
              </View>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                Don’t worry! Enter your registered mobile number and we’ll send you reset instructions.
              </Text>
            </View>

            <Animated.View style={[styles.card, cardStyle]}>
              <CustomInput
                label="Mobile Number"
                value={mobile}
                onChangeText={(t) => {
                  // allow only digits
                  const digits = t.replace(/\D/g, '')
                  setMobile(digits.slice(0, 10))
                  if (error) setError('')
                }}
                placeholder="Enter 10-digit mobile number"
                icon="phone"
                keyboardType="phone-pad"
                maxLength={10}
              />
              {error ? <Text style={styles.err}>{error}</Text> : null}

              <View style={{ height: responsiveHeight(2) }} />

              <CustomButton title="Send Reset Link" onPress={handleSend} isLoading={loading} />

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Remember your password?</Text>
                <TouchableOpacity onPress={() => navigation?.navigate('Login')}>
                  <Text style={styles.footerLink}> Back to Login</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <View style={{ height: responsiveHeight(6) }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  )
}

export default ForgotPassword

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.lightPrimary },
  container: { padding: responsiveWidth(5), paddingTop: responsiveHeight(6), alignItems: 'center' },

  header: { alignItems: 'center', marginBottom: responsiveHeight(2) },
  logoWrap: {
    width: responsiveWidth(18),
    height: responsiveWidth(18),
    borderRadius: responsiveWidth(9),
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    marginBottom: responsiveHeight(1.5),
  },
  title: { fontSize: responsiveFontSize(2), fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: responsiveFontSize(1.05), color: Colors.textSecondary, marginTop: responsiveHeight(0.6), textAlign: 'center', paddingHorizontal: responsiveWidth(4) },

  card: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: responsiveWidth(4),
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

  err: { color: Colors.secondary, marginTop: responsiveHeight(0.6), fontSize: responsiveFontSize(1.0) },

  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: responsiveHeight(2) },
  footerText: { color: Colors.textSecondary },
  footerLink: { color: Colors.primary, fontWeight: '700' },
})