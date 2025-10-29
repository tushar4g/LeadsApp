// ...existing code...
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CustomInput from '../../components/CustomInput'
import CustomDropDown from '../../components/CustomDropDown'
import CustomDateTimePicker from '../../components/CustomDateTimePicker'
import CustomButton from '../../components/CustomButton'
import Colors from '../../style/Colors'

const SOURCE_OPTIONS = [
  { label: 'Doctor', value: 'Doctor' },
  { label: 'Hospital', value: 'Hospital' },
  { label: 'Corporate', value: 'Corporate' },
  { label: 'Event', value: 'Event' },
  { label: 'Online', value: 'Online' },
  { label: 'Referral', value: 'Referral' },
]

const TYPE_OPTIONS = [
  { label: 'Doctor', value: 'Doctor' },
  { label: 'Patient', value: 'Patient' },
  { label: 'Organization', value: 'Organization' },
]

const CITY_OPTIONS = [
  { label: 'Raipur', value: 'Raipur' },
  { label: 'Bilaspur', value: 'Bilaspur' },
]

const STATE_OPTIONS = [
  { label: 'Chhattisgarh', value: 'Chhattisgarh' },
  { label: 'Madhya Pradesh', value: 'Madhya Pradesh' },
]

const STATUS_OPTIONS = [
  { label: 'New', value: 'New' },
  { label: 'Follow-up', value: 'Follow-up' },
  { label: 'Converted', value: 'Converted' },
  { label: 'Lost', value: 'Lost' },
]

const SCORE_OPTIONS = [
  { label: 'Hot', value: 'Hot' },
  { label: 'Warm', value: 'Warm' },
  { label: 'Cold', value: 'Cold' },
]

const ASSIGN_OPTIONS = [
  { label: 'Tushar', value: 'Tushar' },
  { label: 'Amit', value: 'Amit' },
  { label: 'Kiran', value: 'Kiran' },
]

const AddLead = ({ navigation }) => {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [source, setSource] = useState('')
  const [leadType, setLeadType] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [address, setAddress] = useState('')

  const [status, setStatus] = useState('')
  const [score, setScore] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [followUpDate, setFollowUpDate] = useState(null)

  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Lead name is required.')
      return false
    }
    const m = mobile.replace(/\D/g, '')
    if (!m || m.length !== 10) {
      Alert.alert('Validation', 'Mobile number is required and must be 10 digits.')
      return false
    }
    if (!source) {
      Alert.alert('Validation', 'Please select a lead source.')
      return false
    }
    if (!status) {
      Alert.alert('Validation', 'Please select a status.')
      return false
    }
    return true
  }

  const handleSaveLead = async () => {
    if (!validate()) return
    setLoading(true)
    const leadData = {
      name,
      mobile,
      email,
      source,
      leadType,
      city,
      state,
      address,
      status,
      score,
      assignedTo,
      followUpDate,
      notes,
      createdAt: new Date().toISOString(),
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      console.log('Saved Lead:', leadData)
      Alert.alert('Success', 'Lead added successfully!')
      if (navigation) navigation.goBack()
    }, 900)
  }

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation && navigation.goBack()} style={styles.headerLeft}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={Colors.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Add New Lead</Text>

        <TouchableOpacity onPress={handleSaveLead} style={styles.headerRight}>
          <MaterialCommunityIcons name="content-save" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Basic Information */}
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <CustomInput
            label="Lead Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter lead name"
            icon="person"
          />
          <CustomInput
            label="Mobile Number"
            value={mobile}
            onChangeText={(t) => setMobile(t.replace(/[^0-9]/g, ''))}
            placeholder="Enter mobile number"
            keyboardType="numeric"
            maxLength={10}
            icon="phone"
          />
          <CustomInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            keyboardType="email-address"
            icon="email"
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: responsiveWidth(2) }}>
              <CustomDropDown iconName="source" uprLabel="Lead Source" value={source} setValue={setSource} data={SOURCE_OPTIONS} />
            </View>
            <View style={{ flex: 1, marginLeft: responsiveWidth(2) }}>
              <CustomDropDown iconName="category" uprLabel="Lead Type" value={leadType} setValue={setLeadType} data={TYPE_OPTIONS} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: responsiveWidth(2) }}>
              <CustomDropDown iconName="map" uprLabel="State" value={state} setValue={setState} data={STATE_OPTIONS} />
            </View>
            <View style={{ flex: 1, marginLeft: responsiveWidth(2) }}>
              <CustomDropDown iconName="location-city" uprLabel="City" value={city} setValue={setCity} data={CITY_OPTIONS} />
            </View>
          </View>

          <CustomInput  icon="place" label="Address" value={address} onChangeText={setAddress} placeholder="Enter full address" />

          {/* Lead Details */}
          <Text style={styles.sectionTitle}>Lead Details</Text>
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: responsiveWidth(2) }}>
              <CustomDropDown iconName="flag" uprLabel="Status" value={status} setValue={setStatus} data={STATUS_OPTIONS} />
            </View>
            <View style={{ flex: 1, marginLeft: responsiveWidth(2) }}>
              <CustomDropDown iconName="whatshot" uprLabel="Lead Score" value={score} setValue={setScore} data={SCORE_OPTIONS} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: responsiveWidth(2) }}>
              <CustomDropDown iconName="supervisor-account" uprLabel="Assigned To" value={assignedTo} setValue={setAssignedTo} data={ASSIGN_OPTIONS} />
            </View>
            <View style={{ flex: 1, marginLeft: responsiveWidth(2) }}>
              <CustomDateTimePicker
                placeholder="Next follow-up"
                value={followUpDate}
                setDate={setFollowUpDate}
                iconName="calendar-today"
                mode="date"
              />
            </View>
          </View>

          {/* Notes */}
          <Text style={styles.sectionTitle}>Notes / Comments</Text>
          <CustomInput label="Notes" value={notes} onChangeText={setNotes} placeholder="Enter additional notes or comments" icon="note" />

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <CustomButton title={loading ? 'Saving...' : 'Add Lead'} onPress={handleSaveLead} isLoading={loading} />
            {/* <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation && navigation.goBack()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity> */}
          </View>

          <View style={{ height: responsiveHeight(8) }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default AddLead

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  header: {
    height: responsiveHeight(7),
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(3),
    elevation: 2,
  },
  headerLeft: { padding: 8 },
  headerRight: { padding: 8 },
  headerTitle: { flex: 1, textAlign: 'center', color: Colors.white, fontSize: responsiveFontSize(2), fontWeight: '700' },

  container: { padding: responsiveWidth(4), paddingBottom: responsiveHeight(6) },

  sectionTitle: { fontSize: responsiveFontSize(1.6), fontWeight: '700', color: Colors.textPrimary, marginTop: responsiveHeight(1), marginBottom: responsiveHeight(0.6) },

  row: { flexDirection: 'row', alignItems: 'center', marginBottom: responsiveHeight(1) },

  buttonRow: { marginTop: responsiveHeight(2), gap: responsiveWidth(2) },
  cancelBtn: { marginLeft: responsiveWidth(3), paddingVertical: responsiveHeight(1.4), paddingHorizontal: responsiveWidth(4), borderRadius: responsiveWidth(6), borderWidth: 1, borderColor: Colors.primary },
  cancelText: { color: Colors.primary, fontWeight: '700', fontSize: responsiveFontSize(1.6) },
})
