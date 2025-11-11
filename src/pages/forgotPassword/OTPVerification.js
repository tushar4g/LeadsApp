import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../style/Colors';
import CustomButton from '../../components/CustomButton';

const CELL_COUNT = 6;

const OTPVerification = ({ navigation, route }) => {
  const { mobile } = route.params || {};
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(30);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 420, useNativeDriver: true }).start();

    // Start resend timer
    let interval;
    if (resendDisabled) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 30; // Reset timer for next use
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [resendDisabled]);

  const handleVerify = async () => {
    if (value.length !== CELL_COUNT) {
      Alert.alert('Error', 'Please enter the complete OTP.');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // On success, navigate to ResetPassword
      navigation.navigate('ResetPassword', { mobile });
    } catch (error) {
      Alert.alert('Error', error?.message || 'Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    // Resend OTP logic here
    setResendDisabled(true);
    setResendTimer(90); // Reset timer
    setValue(''); // Clear OTP
    Alert.alert('OTP Resent', 'A new OTP has been sent to your mobile number.');
  };

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
  };

  return (
    <View style={styles.safe}>
      <LinearGradient colors={['#E3F2FD', '#FFFFFF']} style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.logoWrap}>
                <MaterialIcons name="local-hospital" size={responsiveFontSize(5.2)} color={Colors.primary} />
              </View>
              <Text style={styles.title}>OTP Verification</Text>
              <Text style={styles.subtitle}>Enter the 6-digit code sent to your registered mobile number.</Text>
              {mobile ? <Text style={styles.contact}>Sent to +91 •••• {mobile.slice(-4)}</Text> : null}
            </View>

            <Animated.View style={[styles.card, cardStyle]}>
              <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                  <Text
                    style={[styles.cell, isFocused && styles.focusCell]}
                    key={index}
                    onLayout={getCellOnLayoutHandler(index)}
                  >
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />

              <View style={{ height: responsiveHeight(2) }} />

              <CustomButton title="Verify OTP" onPress={handleVerify} isLoading={loading} />

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Didn’t receive the code?</Text>
                {resendDisabled ? (
                  <Text style={styles.footerLink}> Resend in {resendTimer}s</Text>
                ) : (
                  <TouchableOpacity onPress={handleResend} disabled={resendDisabled}>
                    <Text style={styles.footerLink}> Resend OTP</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

export default OTPVerification;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.lightPrimary },
  container: {
    flex: 1,
    padding: responsiveWidth(5),
    paddingTop: responsiveHeight(6),
    alignItems: 'center',
  },

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
  title: { fontSize: responsiveFontSize(2.2), fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: responsiveFontSize(1.4), color: Colors.textSecondary, marginTop: responsiveHeight(0.6), textAlign: 'center', paddingHorizontal: responsiveWidth(4) },
  contact: { fontSize: responsiveFontSize(1.4), color: Colors.textTertiary, marginTop: responsiveHeight(0.3) },

  card: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: responsiveWidth(4),
    padding: responsiveWidth(4),
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

    codeFieldRoot: { 
        paddingVertical: responsiveHeight(1),
        marginTop: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(5),
        justifyContent: 'center', 
    },
  cell: {
    backgroundColor: '#f7f7f7ff',
    width: responsiveWidth(11),
    height: responsiveWidth(11),
    lineHeight: responsiveHeight(5),
    fontSize: responsiveFontSize(3),
    borderWidth: responsiveWidth(0.3),
    borderColor: Colors.primary,
    borderRadius: responsiveWidth(2),
    textAlign: 'center',
    marginHorizontal: responsiveWidth(1),
    color: Colors.primary,
    // Android
    elevation: 2,
    // iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  focusCell: {
    borderColor: Colors.primary,
    elevation: 4,
    shadowOpacity: 0.08,
  },

  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: responsiveHeight(2) },
  footerText: { color: Colors.textSecondary },
  footerLink: { color: Colors.primary, fontWeight: '700' },
});
