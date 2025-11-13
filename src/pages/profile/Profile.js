import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Share,
  Platform,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CustomDropDown from '../../components/CustomDropDown'
import CustomButton from '../../components/CustomButton'
import Colors from '../../style/Colors'
import DeviceInfo from 'react-native-device-info'

// optional: replace with your real API service
const getProfile = async () => {
  try {
    // return await apiService.getProfile()
    // mock
    return {
      name: 'Tushar Sahu',
      role: 'Admin',
      avatar: 'https://i.pravatar.cc/150?img=3',
      email: 'tushar.sahu@example.com',
      phone: '9876543210',
      organization: 'ItMingo Health',
    }
  } catch (e) {
    return null
  }
}

const LANG_OPTIONS = [
  { label: 'English', value: 'en' },
  { label: 'हिन्दी', value: 'hi' },
]

const Profile = ({ navigation }) => {
  const [profile, setProfile] = useState(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('en')
  const [appVersion, setAppVersion] = useState('1.0.0') // Default version

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const p = await getProfile()
      if (!mounted) return
      setProfile(p)
      // load saved prefs
      try {
        const n = await AsyncStorage.getItem('prefs_notifications')
        const d = await AsyncStorage.getItem('prefs_darkmode')
        const l = await AsyncStorage.getItem('prefs_language')
        if (n !== null) setNotificationsEnabled(n === '1')
        if (d !== null) setDarkMode(d === '1')
        if (l) setLanguage(l)
        setAppVersion(DeviceInfo.getVersion())
      } catch (e) {
        // ignore
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const onToggleNotifications = async (val) => {
    setNotificationsEnabled(val)
    await AsyncStorage.setItem('prefs_notifications', val ? '1' : '0')
  }
  const onToggleDark = async (val) => {
    setDarkMode(val)
    await AsyncStorage.setItem('prefs_darkmode', val ? '1' : '0')
    // optional: emit event to app theme manager
  }
  const onChangeLanguage = async (val) => {
    setLanguage(val)
    await AsyncStorage.setItem('prefs_language', val)
    // optional: reload translations
  }

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear()
          navigation?.reset?.({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        },
      },
    ])
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out the Healthcare CRM app - https://example.com',
      })
    } catch (err) {
      Alert.alert('Share', 'Unable to open share dialog')
    }
  }

  const Row = ({ icon, label, onPress, rightComponent }) => (
    <TouchableOpacity activeOpacity={onPress ? 0.7 : 1} onPress={onPress} style={styles.row}>
      <View style={styles.rowLeft}>
        <MaterialCommunityIcons name={icon} size={responsiveFontSize(2.2)} color={Colors.textPrimary} />
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      {rightComponent ? rightComponent : <MaterialCommunityIcons name="chevron-right" size={responsiveFontSize(2.2)} color={Colors.textSecondary} />}
    </TouchableOpacity>
  )

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerBackground} />

      <View style={styles.top}>
        <TouchableOpacity style={styles.avatarWrap} onPress={() => navigation?.navigate?.('EditProfile')}>
          {profile?.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <MaterialCommunityIcons name="account-circle" size={responsiveWidth(22)} color={Colors.profileOpacity} />
            </View>
          )}
          <View style={styles.editAvatar}>
            <MaterialCommunityIcons name="pencil" size={14} color={Colors.white} />
          </View>
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Text style={styles.name}>{profile?.name ?? 'User Name'}</Text>
          {/* <Text style={styles.role}>{profile?.role ?? 'Role'} • {profile?.organization ?? ''}</Text> */}
           <Text style={styles.role}>{profile?.designation ? `${profile.designation} • ` : ''}{profile?.role ?? 'Role'} • {profile?.organization ?? ''}</Text>
          <Text style={styles.subText}>Healthcare CRM Account</Text>
        </View>
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Row icon="account" label="My Profile" onPress={() => navigation?.navigate('EditProfile')} />
        <Row icon="lock" label="Change Password" onPress={() => navigation?.navigate('ChangePassword')} />
      </View>

      {/* Organization */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Organization</Text>
        <Row icon="file-document-multiple" label="My Leads" onPress={() => navigation?.navigate('Leads')} />
        {/* <Row icon="calendar" label="My Appointments" onPress={() => navigation?.navigate('Appointments')} /> */}
        <Row icon="gift" label="My Rewards" onPress={() => navigation?.navigate('Rewards')} />
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <MaterialCommunityIcons name="bell" size={responsiveFontSize(2.2)} color={Colors.textPrimary} />
          </View>
          <View style={styles.rowBody}>
            <Text style={styles.rowLabel}>Notifications</Text>
          </View>
          {/* <Switch value={notificationsEnabled} onValueChange={onToggleNotifications} thumbColor={notificationsEnabled ? Colors.primary : Colors.white} /> */}
        </View>

        {/* <View style={styles.row}>
          <View style={styles.rowLeft}>
            <MaterialCommunityIcons name="translate" size={20} color={Colors.primary} />
          </View>
          <View style={styles.rowBody}>
            <Text style={styles.rowLabel}>Language</Text>
          </View>
          <View style={{ width: responsiveWidth(38) }}>
            <CustomDropDown iconName="language" value={language} setValue={onChangeLanguage} data={LANG_OPTIONS} dropdownPosition="bottom" placeholder="Language" />
          </View>
        </View> */}

        {/* <View style={styles.row}>
          <View style={styles.rowLeft}>
            <MaterialCommunityIcons name="theme-light-dark" size={20} color={Colors.primary} />
          </View>
          <View style={styles.rowBody}>
            <Text style={styles.rowLabel}>Dark Mode</Text>
          </View>
          <Switch value={darkMode} onValueChange={onToggleDark} thumbColor={darkMode ? Colors.primary : Colors.white} />
        </View> */}
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <Row icon="message-text" label="Feedback & Suggestions" onPress={() => navigation?.navigate('Feedback')} />
        <Row icon="help-circle" label="Help & Support" onPress={() => navigation?.navigate('HelpSupport')} />
        <Row icon="file-document" label="Privacy Policy" onPress={() => navigation?.navigate('PrivacyPolicy')} />
        <Row icon="file-word" label="Terms & Conditions" onPress={() => navigation?.navigate('TermsAndConditions')} />
      </View>

      {/* Other */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other</Text>
        <Row icon="share-variant" label="Refer App" onPress={handleShare} />
        <TouchableOpacity style={[styles.row, { justifyContent: 'center', paddingVertical: responsiveHeight(1.6) }]} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color={Colors.secondary} />
          <Text style={[styles.rowLabel, { color: Colors.secondary, marginLeft: responsiveWidth(3) }]}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.versionWrap}>
        <Text style={styles.versionText}>App Version {appVersion}</Text>
        <Text style={styles.versionText}>© {new Date().getFullYear()} ItMingo. All Rights Reserved.</Text>
      </View>

      <View style={{ height: responsiveHeight(3) }} />
    </ScrollView>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: { paddingBottom: responsiveHeight(6), backgroundColor: Colors.background, minHeight: '100%' },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: responsiveHeight(22),
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: responsiveWidth(5),
    borderBottomRightRadius: responsiveWidth(5),
    zIndex: -1,
  },
  top: { flexDirection: 'row', paddingHorizontal: responsiveWidth(4), paddingTop: responsiveHeight(4), alignItems: 'center', paddingBottom: responsiveHeight(1)},
  avatarWrap: { marginRight: responsiveWidth(4) },
  avatar: { width: responsiveWidth(22), height: responsiveWidth(22), borderRadius: responsiveWidth(11) },
  avatarPlaceholder: { width: responsiveWidth(22), height: responsiveWidth(22), borderRadius: responsiveWidth(11), backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
  editAvatar: { position: 'absolute', right: 0, bottom: 0, backgroundColor: Colors.primary, padding: 6, borderRadius: 14, borderWidth: 2, borderColor: Colors.white },

  userInfo: { flex: 1 },
  name: { fontSize: responsiveFontSize(2.2), fontWeight: '800', color: Colors.white, marginBottom: 2 },
  role: { fontSize: responsiveFontSize(1.6), color: Colors.white, opacity: 0.95, fontWeight: '400'},
  subText: { fontSize: responsiveFontSize(1.6), color: Colors.white, opacity: 0.9, marginTop: responsiveHeight(0.2), fontWeight: '400' },

  section: { marginTop: responsiveHeight(2), marginHorizontal: responsiveWidth(3), backgroundColor: Colors.white, borderRadius: 12, paddingVertical: responsiveHeight(0.8), paddingHorizontal: responsiveWidth(2), elevation: 1 },
  sectionTitle: { fontWeight: '700', fontSize: responsiveFontSize(1.2), color: Colors.textPrimary, marginBottom: responsiveHeight(0.6) },

  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: responsiveHeight(1.1) },
  rowLeft: { width: responsiveWidth(10), alignItems: 'center' },
  rowBody: { flex: 1 },
  rowLabel: { fontSize: responsiveFontSize(1.4), color: Colors.textPrimary, fontWeight: '500'},

  versionWrap: { alignItems: 'center', marginTop: responsiveHeight(2), gap: responsiveHeight(0.5)},
  versionText: { color: Colors.textSecondary, fontSize: responsiveFontSize(1) },
})