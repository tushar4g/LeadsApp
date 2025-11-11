import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Animated,
  ToastAndroid,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Colors from '../../style/Colors';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

// Password must be at least 8 chars, have 1 uppercase, 1 lowercase, 1 digit, 1 special char
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const ResetPassword = ({ navigation, route }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ newPassword: '', confirmPassword: '' });
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const validate = () => {
    const newErrors = { newPassword: '', confirmPassword: '' };
    let isValid = true;

    if (!newPassword) {
      newErrors.newPassword = 'New password is required.';
      isValid = false;
    } else if (!PASSWORD_RE.test(newPassword)) {
      newErrors.newPassword = 'Password must be 8+ chars with uppercase, lowercase, digit, and special character.';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
      isValid = false;
    } else if (newPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleResetPassword = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to reset password
      await new Promise(resolve => setTimeout(resolve, 1500));

      // On success
      ToastAndroid.show('Password reset successfully!', ToastAndroid.SHORT);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });

    } catch (error) {
      Alert.alert('Error', error?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [30, 0],
        }),
      },
    ],
    opacity: anim,
  };

  return (
    <View style={styles.safe}>
      <LinearGradient colors={[Colors.lightPrimary, Colors.white]} style={styles.gradient}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <View style={styles.logoWrap}>
                <MaterialIcons name="local-hospital" size={responsiveFontSize(5.2)} color={Colors.primary} />
              </View>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>Enter and confirm your new password to continue.</Text>
            </View>

            <Animated.View style={[styles.card, cardStyle]}>
              <CustomInput
                label="New Password"
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: '' }));
                }}
                placeholder="Enter new password"
                icon="lock"
                isPassword={true}
              />
              {errors.newPassword ? <Text style={styles.errorText}>{errors.newPassword}</Text> : null}

              <View style={{ height: responsiveHeight(1.5) }} />

              <CustomInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }}
                placeholder="Re-enter new password"
                icon="lock"
                isPassword={true}
              />
              {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

              <View style={{ height: responsiveHeight(2.5) }} />

              <CustomButton title="Reset Password" onPress={handleResetPassword} isLoading={loading} />

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Remember your password?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.footerLink}> Login</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.lightPrimary },
  gradient: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: responsiveWidth(5),
  },
  header: {
    alignItems: 'center',
    marginBottom: responsiveHeight(3),
  },
  logoWrap: {
    width: responsiveWidth(18),
    height: responsiveWidth(18),
    borderRadius: responsiveWidth(9),
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    marginBottom: responsiveHeight(2),
  },
  title: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: responsiveFontSize(1.5),
    color: Colors.textSecondary,
    marginTop: responsiveHeight(0.8),
    textAlign: 'center',
    paddingHorizontal: responsiveWidth(4),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: responsiveWidth(5),
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  errorText: {
    color: Colors.secondary,
    fontSize: responsiveFontSize(1.3),
    marginTop: responsiveHeight(0.5),
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(2.5),
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: responsiveFontSize(1.5),
  },
  footerLink: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: responsiveFontSize(1.5),
  },
});