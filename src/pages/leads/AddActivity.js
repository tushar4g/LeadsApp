import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CustomDropDown from '../../components/CustomDropDown'
import CustomInput from '../../components/CustomInput'
import CustomDateTimePicker from '../../components/CustomDateTimePicker'
import CustomButton from '../../components/CustomButton'
import Colors from '../../style/Colors'
import Geolocation from '@react-native-community/geolocation'

// optional - requires react-native-image-picker in project
let ImagePicker
try {
  // eslint-disable-next-line global-require
  ImagePicker = require('react-native-image-picker')
} catch (e) {
  ImagePicker = null
}

const ACTIVITY_TYPES = [
  { label: 'Call', value: 'Call' },
  { label: 'Meeting', value: 'Meeting' },
  { label: 'Follow-up', value: 'Follow-up' },
  { label: 'WhatsApp', value: 'WhatsApp' },
  { label: 'Email', value: 'Email' },
  { label: 'Other', value: 'Other' },
]

const STATUS_OPTIONS = [
  { label: 'Planned', value: 'Planned' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' },
]

const ASSIGN_OPTIONS = [
  { label: 'Tushar', value: 'Tushar' },
  { label: 'Amit', value: 'Amit' },
  { label: 'Kiran', value: 'Kiran' },
]

const formatDateForAPI = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const AddActivity = ({ route, navigation }) => {
  const leadId = route?.params?.leadId ?? route?.params?.lead?.id

  const [activityType, setActivityType] = useState('')
  const [dateTime, setDateTime] = useState(null)
  const [status, setStatus] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [outcome, setOutcome] = useState('')
  const [nextFollowUp, setNextFollowUp] = useState(null)
  const [attachment, setAttachment] = useState(null)
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    if (!activityType) {
      Alert.alert('Validation', 'Please select activity type.')
      return false
    }
    if (!dateTime) {
      Alert.alert('Validation', 'Please select date & time.')
      return false
    }
    if (!status) {
      Alert.alert('Validation', 'Please select status.')
      return false
    }
    return true
  }

//   const requestLocation = async () => {
//     try {
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Permission',
//             message: 'App needs access to your location to attach it to the activity.',
//             buttonPositive: 'OK',
//             buttonNegative: 'Cancel',
//           }
//         )
//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) return null
//       }
//       return new Promise((resolve) => {
//         navigator.geolocation.getCurrentPosition(
//           (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
//           () => resolve(null),
//           { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
//         )
//       })
//     } catch (e) {
//       return null
//     }
//   }

    const requestLocation = async () => {
        try {
            if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                title: 'Location Permission',
                message: 'App needs access to your location to attach it to the activity.',
                buttonPositive: 'OK',
                buttonNegative: 'Cancel',
                }
            )
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert('Permission denied', 'Location permission is required to attach location.')
                return null
            }
            } else {
            // for iOS make sure Info.plist has NSLocationWhenInUseUsageDescription
            try { Geolocation.requestAuthorization?.('whenInUse') } catch (e) {}
            }

            return new Promise((resolve) => {
            Geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => {
                console.warn('Geolocation error', err)
                resolve(null)
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
            )
            })
        } catch (e) {
            console.warn('requestLocation error', e)
            return null
        }
    }

  const pickImage = async () => {
    if (!ImagePicker) {
      Alert.alert('Not available', 'Image picker not installed.')
      return
    }
    const options = { mediaType: 'photo', quality: 0.7 }
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) return
      if (response.errorCode) {
        Alert.alert('Image Error', response.errorMessage || 'Could not pick image')
        return
      }
      // response.assets is array in newer versions
      const asset = response?.assets?.[0] ?? response
      if (asset) setAttachment({ uri: asset.uri, name: asset.fileName, type: asset.type })
    })
  }

  const handleSave = async () => {
    if (!validate()) return

    setLoading(true)

    // optionally get location
    const coords = await requestLocation()
    if (coords) setLocation(coords)

    const payload = {
      leadId,
      type: activityType,
      datetime: formatDateForAPI(dateTime),
      status,
      assignedTo,
      outcome,
      nextFollowUp: formatDateForAPI(nextFollowUp),
      attachment,
      location: coords,
      createdAt: new Date().toISOString(),
    }

    console.log('Saving activity:', payload)

    // Replace with real API: await apiService.createActivity(payload)
    try {
      // simulate network
      setTimeout(() => {
        setLoading(false)
        if (Platform.OS === 'android') {
          ToastAndroid.show('Activity added successfully', ToastAndroid.SHORT)
        } else {
          Alert.alert('Success', 'Activity added successfully')
        }
        if (navigation) navigation.goBack()
      }, 900)
    } catch (err) {
      setLoading(false)
      Alert.alert('Error', 'Failed to save activity. Please try again.')
    }
  }

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation && navigation.goBack()} style={styles.headerLeft}>
          <MaterialCommunityIcons name="arrow-left" size={responsiveFontSize(2.2)} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Activity</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Activity Details</Text>

          <CustomDropDown iconName="work-outline" uprLabel="Activity Type" value={activityType} setValue={setActivityType} data={ACTIVITY_TYPES} placeholder="Select type" />

          <View style={{ marginTop: responsiveHeight(1) }}>
            <CustomDateTimePicker placeholder="Date & Time" value={dateTime} setDate={setDateTime} iconName="calendar-today" />
          </View>

          <View style={{ marginTop: responsiveHeight(1) }}>
            <CustomDropDown iconName="check-circle-outline" uprLabel="Status" value={status} setValue={setStatus} data={STATUS_OPTIONS} placeholder="Select status" />
          </View>

          <View style={{ marginTop: responsiveHeight(1) }}>
            <CustomDropDown iconName="supervisor-account" uprLabel="Assigned To" value={assignedTo} setValue={setAssignedTo} data={ASSIGN_OPTIONS} placeholder="Assign to" />
          </View>

          <View style={{ marginTop: responsiveHeight(1) }}>
            <CustomInput icon={'notes'} label="Outcome / Remarks" value={outcome} onChangeText={setOutcome} placeholder="Enter outcome or remarks" isPassword={false} multiline />
          </View>

          <View style={{ marginTop: responsiveHeight(1) }}>
            <CustomDateTimePicker placeholder="Next Follow-up (optional)" value={nextFollowUp} setDate={setNextFollowUp} mode="date" iconName="event-repeat" />
          </View>

          <View style={{ marginTop: responsiveHeight(1), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity style={styles.attachBtn} onPress={pickImage}>
              <MaterialCommunityIcons name="paperclip" size={18} color={Colors.primary} />
              <Text style={styles.attachText}>{attachment ? 'Attachment added' : 'Add Attachment'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.locBtn}
              onPress={async () => {
                const coords = await requestLocation()
                if (coords) {
                  setLocation(coords)
                  Alert.alert('Location captured', `Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)}`)
                } else {
                  Alert.alert('Location', 'Unable to fetch location')
                }
              }}
            >
              <MaterialCommunityIcons name="map-marker" size={18} color={Colors.primary} />
              <Text style={styles.attachText}>{location ? 'Location attached' : 'Attach Location'}</Text>
            </TouchableOpacity>
          </View>

          {attachment && (
            <View style={{ marginTop: responsiveHeight(1), alignItems: 'flex-start' }}>
              <Image source={{ uri: attachment.uri }} style={styles.previewImage} />
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <View style={{ flex: 1, }}>
            <CustomButton title={loading ? 'Saving...' : 'Add Activity'} onPress={handleSave} isLoading={loading} />
          </View>
          {/* <View style={{ flex: 1, marginLeft: responsiveWidth(2) }}>
            <TouchableOpacity onPress={() => navigation && navigation.goBack()} style={styles.cancelWrap}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View> */}
        </View>

        <View style={{ height: responsiveHeight(8) }} />
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </View>
  )
}

export default AddActivity

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    height: responsiveHeight(7),
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(3),
    elevation: 2,
  },
  headerLeft: { padding: 6 },
  headerTitle: { flex: 1, textAlign: 'center', color: Colors.white, fontSize: responsiveFontSize(2), fontWeight: '700' },
  headerRight: { width: responsiveWidth(10) },

  container: { padding: responsiveWidth(4), paddingBottom: responsiveHeight(6) },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(1.2),
    elevation: 1,
  },

  sectionTitle: { fontSize: responsiveFontSize(1.6), fontWeight: '700', color: Colors.textPrimary, marginBottom: responsiveHeight(0.8) },

  attachBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  locBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  attachText: { marginLeft: 8, color: Colors.textSecondary },

  previewImage: { width: responsiveWidth(30), height: responsiveWidth(20), borderRadius: 8, marginTop: responsiveHeight(0.5) },

  actions: { flexDirection: 'row', marginTop: responsiveHeight(2), alignItems: 'center' },
  cancelWrap: { backgroundColor: Colors.white, borderColor: Colors.primary, borderWidth: 1, paddingVertical: responsiveHeight(1.2), borderRadius: responsiveWidth(6), alignItems: 'center' },
  cancelText: { color: Colors.primary, fontWeight: '700', fontSize: responsiveFontSize(1.6) },

  loadingOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.6)' },
})