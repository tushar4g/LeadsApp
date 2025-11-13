// ...existing code...
import React, {useEffect, useState} from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import Colors from '../../style/Colors'
import CustomInput from '../../components/CustomInput'
import CustomDropDown from '../../components/CustomDropDown'
import CustomDateTimePicker from '../../components/CustomDateTimePicker'
import CustomButton from '../../components/CustomButton'
import CustomMultipleDropdown from '../../components/CustomMultipleDropdown'
import Geolocation from '@react-native-community/geolocation'

const VISIT_TYPES = [
  { label: 'Call', value: 'Call' },
  { label: 'Meeting', value: 'Meeting' },
  { label: 'Follow-up', value: 'Follow-up' },
]

const specializationOptions = [
  { label: 'Cardiologist', value: 'cardiologist' },
  { label: 'Dermatologist', value: 'dermatologist' },
  { label: 'Neurologist', value: 'neurologist' },
  { label: 'Pediatrician', value: 'pediatrician' },
  { label: 'General Physician', value: 'general' },
]

const LOCATION_TYPES = [
  { label: 'Clinic', value: 'Clinic' },
  { label: 'Hospital', value: 'Hospital' },
  { label: 'Office', value: 'Office' },
  { label: 'Other', value: 'Other' },
]

const STATUS_OPTIONS = [
  { label: 'Planned', value: 'Planned' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' },
]

const PRIORITY_OPTIONS = [
  { label: 'High', value: 'High' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' },
]

/* --- Fake API (replace with network calls) --- */
const fakeApi = {
  getLeadsOrDoctors: async () =>
    new Promise((res) =>
      setTimeout(
        () =>
          res([
            { label: 'Dr. Anil Mehta', value: 'dr-anil', specialty: 'Cardiology', mobile: '9876543210' },
            { label: 'Dr. Shweta Sharma', value: 'dr-shweta', specialty: 'Dermatology', mobile: '9123456780' },
            { label: 'Ms. Rekha Singh', value: 'rekha-singh', specialty: 'N/A', mobile: '9000000000' },
          ]),
        300
      )
    ),
  getUsers: async () =>
    new Promise((res) =>
      setTimeout(() => res([{ label: 'Field Exec 1', value: 'fe1' }, { label: 'Field Exec 2', value: 'fe2' }]), 300)
    ),
  createVisit: async (payload) =>
    new Promise((res) => setTimeout(() => res({ success: true, visit: { ...payload, id: `v-${Date.now()}` } }), 600)),
}

/* --- Helper: get current location (best effort) --- */
// const getCurrentLocation = (onSuccess, onError) => {
//   try {
//     if (navigator?.geolocation?.getCurrentPosition) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           const { latitude, longitude } = pos.coords
//           onSuccess({ latitude, longitude })
//         },
//         (err) => onError && onError(err),
//         { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
//       )
//     } else {
//       onError && onError(new Error('Geolocation not available'))
//     }
//   } catch (e) {
//     onError && onError(e)
//   }
// }

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location to auto-fill visit address.',
          buttonPositive: 'OK',
        }
      )
     return granted === PermissionsAndroid.RESULTS.GRANTED
   } catch (err) {
      return false
    }
  }
 // iOS will prompt when using Geolocation.getCurrentPosition if Info.plist keys are present
  return true
}

const getCurrentLocation = async (onSuccess, onError) => {
  const ok = await requestLocationPermission()
  if (!ok) {
    onError && onError(new Error('Location permission denied'))
    return
  }

  Geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords
      onSuccess && onSuccess({ latitude, longitude })
    },
    (err) => {
      onError && onError(err)
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
  )
}

const AddVisit = ({ navigation, route }) => {
  const isAdmin = route?.params?.isAdmin ?? false

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [leads, setLeads] = useState([])
  const [users, setUsers] = useState([])

  // individual state per field (replaces single form object)
  const [visitType, setVisitType] = useState('Call')
  const [date, setDate] = useState(new Date()) // yyyy-mm-dd
  const [time, setTime] = useState(new Date()) // HH:MM
  const [status, setStatus] = useState('Planned')

  const [lead, setLead] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [specialty, setSpecialty] = useState('')
  const [mobile, setMobile] = useState('')

  const [locationType, setLocationType] = useState('Clinic')
  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [locationLoader, setLocationLoader] =  useState(false)

  const [notes, setNotes] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [repeat, setRepeat] = useState(false)
  const [reminder, setReminder] = useState(false)

  const [errors, setErrors] = useState({})

  useEffect(() => {
    let mounted = true
    setLoading(true)
    Promise.all([fakeApi.getLeadsOrDoctors(), fakeApi.getUsers()])
      .then(([l, u]) => {
        if (!mounted) return
        setLeads(l)
        setUsers(u)
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const clearError = (key) => setErrors((e) => ({ ...e, [key]: null }))

  const validate = () => {
    const e = {}
    if (!visitType) e.visitType = 'Visit type is required'
    if (!lead) e.lead = 'Please select lead/doctor'
    if (!date) e.date = 'Date is required'
    if (!time) e.time = 'Time is required'
    // check future datetime
    if (date && time) {
      const dtString = `${date}T${time}${Platform.OS === 'ios' ? '' : ':00'}`
      const dt = new Date(dtString)
      if (isNaN(dt.getTime())) {
        e.date = 'Invalid date/time'
      } else if (dt < new Date()) {
        e.date = 'Cannot schedule to past date/time'
      }
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onUseCurrentLocation = () => {
    setLocationLoader(true)
    getCurrentLocation(
      (loc) => {
        setLatitude(loc.latitude)
        setLongitude(loc.longitude)
        setAddress(`Lat ${loc.latitude.toFixed(5)}, Lon ${loc.longitude.toFixed(5)}`)
        Alert.alert('Location captured', 'Current coordinates have been set.')
      },
      (err) => Alert.alert('Location error', err?.message || 'Unable to fetch location')
      ).finally(() => setLocationLoader(false)
    )
  }

  const onLeadChange = (val) => {
    setLead(val)
    clearError('lead')
    const selected = leads.filter((l) => val.includes(l.value));
    if (selected) {
      setSpecialty(selected.specialty || '')
      setMobile(selected.mobile || '')
    } else {
      setSpecialty('')
      setMobile('')
    }
  }

  const onSave = async () => {
    if (!validate()) {
      Alert.alert('Validation', 'Please fix highlighted errors.')
      return
    }
    setSaving(true)
    const payload = {
      visitType,
      datetime: `${date}T${time}:00Z`,
      status,
      lead,
      specialty,
      mobile,
      locationType,
      address,
      latitude,
      longitude,
      notes,
      assignedTo,
      priority,
      repeat,
      reminder,
    }

    try {
      const res = await fakeApi.createVisit(payload)
      if (res?.success) {
        Alert.alert('Success', 'Visit scheduled successfully.')
        navigation?.navigate?.('ScheduleVisit') || navigation?.goBack?.()
      } else {
        Alert.alert('Error', 'Unable to schedule visit. Try again.')
      }
    } catch (err) {
      Alert.alert('Error', err?.message || 'Unable to schedule visit.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Visit</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Visit Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Visit Information</Text>
            <View>
                <CustomDropDown
                    uprLabel="Visit Type *"
                    title="Visit Type *"
                    iconName="work-outline"
                    value={visitType}
                    setValue={(v) => {
                    setVisitType(v)
                    clearError('visitType')
                    }}
                    data={VISIT_TYPES}
                    placeholder="Select visit type"
                />
                {errors.visitType ? <Text style={styles.error}>{errors.visitType}</Text> : null}
            </View>

            <View style={{ flexDirection: 'row', gap: responsiveWidth(2) }}>
                <View style={{ flex: 1 }}>
                    <CustomDateTimePicker
                        label="Date *"
                        iconName={'event'}
                        mode="date"
                        placeholder="Date"
                        value={date}
                        setDate={(d) => {
                        setDate(d)
                        clearError('date')
                        }}
                    />
                    
                    {errors.date ? <Text style={styles.error}>{errors.date}</Text> : null}
                </View>
                <View style={{ width: responsiveWidth(2) }} />
                <View style={{ flex: 1 }}>
                    <CustomDateTimePicker
                        label="Time *"
                        iconName={'access-time'}
                        placeholder="Time"
                        mode="time"
                        value={time}
                        setDate={(t) => {
                        setTime(t)
                        clearError('time')
                        }}
                    />
                    {errors.time ? <Text style={styles.error}>{errors.time}</Text> : null}
                </View>
            </View>

            <CustomDropDown
                uprLabel="Status"
                iconName='info'
                value={status}
                setValue={(v) => setStatus(v)}
                data={STATUS_OPTIONS}
                placeholder="Select status"
            />
        </View>

        {/* Lead / Doctor Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Doctor Details</Text>
          
          <CustomMultipleDropdown
            uprLabel="Doctor *"
            iconName="doctor"
            value={doctors}
            setValue={setDoctors}
            data={leads}
            placeholder="Doctor's"
          />

          {errors.lead ? <Text style={styles.error}>{errors.lead}</Text> : null}

          <CustomDropDown uprLabel="Specialization *" value={specialty} setValue={setSpecialty} data={specializationOptions} iconName="medical-services" placeholder="Select specialization" />

          <CustomInput icon='phone' label="Mobile Number" value={mobile} onChangeText={(t) => setMobile(t)} placeholder="Mobile" keyboardType="phone-pad" />
        </View>

        {/* Location Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location Details</Text>

          <CustomDropDown iconName='place' uprLabel="Location Type" value={locationType} setValue={(v) => setLocationType(v)} data={LOCATION_TYPES} placeholder="Select type" />

          <CustomInput icon='my-location' label="Location" value={address} onChangeText={(t) => setAddress(t)} placeholder="Address / Clinic" multiline />

          <View style={{ flexDirection: 'row', marginTop: responsiveHeight(1) }}>
            <View style={{ flex: 1 }}>
              <CustomButton title="Use My Current Location" onPress={onUseCurrentLocation} bgColor={Colors.white} color={Colors.primary} borderC={Colors.primary} isLoading={locationLoader} />
            </View>
          </View>

          {latitude && longitude ? (
            <Text style={styles.smallText}>Coords: {latitude.toFixed(5)}, {longitude.toFixed(5)}</Text>
          ) : null}
        </View>

        {/* Notes / Assignment */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notes & Assignment</Text>

          <CustomInput icon={'notes'} label="Purpose / Notes" multiline value={notes} onChangeText={(t) => setNotes(t)} placeholder="Purpose of visit / agenda" />

          {isAdmin && (
            <CustomDropDown iconName={'assignment-ind'} title="Assigned To" value={assignedTo} setValue={(v) => setAssignedTo(v)} data={users} placeholder="Select user" />
          )}

          <CustomDropDown iconName={'priority-high'} title="Priority" value={priority} setValue={(v) => setPriority(v)} data={PRIORITY_OPTIONS} placeholder="Select priority" />

          {/* Optional extras */}
          <View style={{ marginTop: responsiveHeight(1) }}>
            <CustomButton title="Save" onPress={onSave} bgColor={Colors.primary} color={Colors.white} loading={saving} />
            <View style={{ height: responsiveHeight(1) }} />
            <CustomButton title="Cancel" onPress={() => navigation?.goBack()} bgColor={Colors.white} color={Colors.primary} borderC={Colors.primary} />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default AddVisit

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    height: responsiveHeight(7),
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(3),
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: responsiveFontSize(1.8), fontWeight: '700', color: Colors.white },

  content: { padding: responsiveWidth(3), paddingBottom: responsiveHeight(6) },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(1.4),
    elevation: 2,
    gap: responsiveHeight(1.5),
  },
  cardTitle: { fontSize: responsiveFontSize(1.6), fontWeight: '600', color: Colors.textPrimary, marginBottom: responsiveHeight(0) },

  error: { color: Colors.secondary, marginTop: responsiveHeight(0.4), fontSize: responsiveFontSize(0.95) },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  smallText: { color: Colors.textSecondary, marginTop: responsiveHeight(0.8) },
})
// ...existing code...