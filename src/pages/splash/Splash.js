import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  StatusBar,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Colors from '../../style/Colors';

const Splash = ({ navigation }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the fade-in and scale-up animation
    Animated.timing(anim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Simulate initialization and check for token
    const timer = setTimeout(async () => {
      try {
        const token = await AsyncStorage.getItem('@token');
        if (token) {
          // User is logged in, navigate to Home screen
          navigation.replace('Main');
        } else {
          // User is not logged in, navigate to Login screen
          navigation.replace('Login');
        }
      } catch (e) {
        // Error reading token, default to Login screen
        console.error('Failed to fetch token from storage', e);
        navigation.replace('Login');
      }
    }, 2500); // Splash screen duration

    return () => clearTimeout(timer);
  }, [navigation, anim]);

  // Interpolate animated value for styles
  const contentStyle = {
    opacity: anim,
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.85, 1],
        }),
      },
    ],
  };

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.lightPrimary} />
      <LinearGradient colors={[Colors.lightPrimary, Colors.white]} style={styles.container}>
        <Animated.View style={[styles.content, contentStyle]}>
          <View style={styles.logoWrapper}>
            <Image source={require('../../assets/images/img1.jpg')} style={styles.logo} />
          </View>
          <Text style={styles.title}>Healthcare CRM</Text>
          <Text style={styles.subtitle}>Empowering Healthcare Connections</Text>
        </Animated.View>
        <ActivityIndicator style={styles.loader} size="small" color={Colors.primary} />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoWrapper: {
    width: responsiveWidth(35),
    height: responsiveWidth(35),
    borderRadius: responsiveWidth(17.5),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  logo: {
    width: responsiveWidth(25),
    height: responsiveWidth(25),
    resizeMode: 'contain',
  },
  title: {
    fontSize: responsiveFontSize(3.5),
    fontWeight: 'bold',
    color: '#1E3A8A', // Dark Blue
    marginTop: responsiveHeight(3),
  },
  subtitle: {
    fontSize: responsiveFontSize(1.8),
    color: Colors.textSecondary,
    marginTop: responsiveHeight(1),
  },
  loader: {
    position: 'absolute',
    bottom: responsiveHeight(8),
  },
});

export default Splash;