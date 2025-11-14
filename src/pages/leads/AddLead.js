// ...existing code...
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import CustomInput from '../../components/CustomInput'
import CustomDropDown from '../../components/CustomDropDown'
import CustomDateTimePicker from '../../components/CustomDateTimePicker'
import CustomButton from '../../components/CustomButton'
import PickImageComponent from '../../components/PickImageComponent'
import Colors from '../../style/Colors'

const SOURCE_OPTIONS = [
  { label: 'Doctor', value: 'Doctor' },
  { label: 'Hospital', value: 'Hospital' },
  { label: 'Event', value: 'Event' },
  { label: 'Other', value: 'Other' },
]

const TYPE_OPTIONS = [
  { label: 'Patient', value: 'Patient' },
  // { label: 'Doctor', value: 'Doctor' },
  // { label: 'Organization', value: 'Organization' },
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

const REFFERED_BY_OPTIONS = [
  { label: 'Dr. Sharma', value: 'Dr. Sharma' },
  { label: 'Dr. Verma', value: 'Dr. Verma' },
  { label: 'Dr. Singh', value: 'Dr. Singh' },
  { label: 'Dr. Gupta', value: 'Dr. Gupta' },
  { label: 'Dr. Rajiv Patel', value: 'Dr. Rajiv Patel' },
]

const CATEGORY_OPTIONS = [
  { label: 'IPD', value: 'IPD' },
  { label: 'OPD', value: 'OPD' },
]

const SPECIALIZATION_OPTIONS = [
  { label: 'Cardiologist', value: 'cardiologist' },
  { label: 'Dermatologist', value: 'dermatologist' },
  { label: 'Neurologist', value: 'neurologist' },
  { label: 'Pediatrician', value: 'pediatrician' },
  { label: 'General Physician', value: 'general' },
]

const AddLead = ({ navigation, route }) => {
  const lead = route?.params?.lead ?? {}   // from lead page
  const isEditMode = !!route.params?.lead;
  const prefill = route?.params?.prefill ?? {} // from doctor details refer patient 
  const isReferMode = !!route.params?.prefill;
  console.log('Lead:', lead, 'editmode',isEditMode)
  console.log('Prefill:', prefill, 'referMode', isReferMode)


  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [leadType, setLeadType] = useState('')
  const [city, setCity] = useState('')
  const [date, setDate] = useState(new Date())
  // const [state, setState] = useState('')
  // const [address, setAddress] = useState('')
  
  const [source, setSource] = useState('')
  const [refferedBy, setRefferedBy] = useState('')
  const [category, setCategory] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [status, setStatus] = useState('')
  const [score, setScore] = useState('')
  const [followUpDate, setFollowUpDate] = useState(null)
  const [prescriptionImage, setPrescriptionImage] = useState(null)

  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEditMode && lead) {
      // existing edit logic
      setName(lead.name || '');
      setAge(lead.age || '');
      setMobile(lead.mobile || '');
      setEmail(lead.email || '');
      setSource(lead.source || '');
      setLeadType(lead.leadType || '');
      setCity(lead.city || '');
      // setState(lead.state || '');
      // setAddress(lead.address || '');
      setStatus(lead.status || '');
      setScore(lead.score || '');
      setRefferedBy(lead.referredBy || '');
      setFollowUpDate(lead.followUpDate || null);
      setCategory(lead.category || '');
      setSpecialization(lead.specialization || '');
      setPrescriptionImage(lead.prescriptionImage || null);
      setNotes(lead.notes || '');
    } else if (isReferMode && prefill) {
      // prefill from Refer Patient
      setSource(prefill.source || '');
      setLeadType(prefill.leadType || '');
      setRefferedBy(prefill.referredBy || ''); // This will now be searchable
    }
  }, [lead, isEditMode, prefill]);


  // useEffect(() => {
  //     if (isEditMode && lead) {
  //       setName(lead.name || '')
  //       setMobile(lead.mobile || '')
  //       setEmail(lead.email || '')
  //       setSource(lead.source || '')
  //       setLeadType(lead.leadType || '')
  //       setCity(lead.city || '')
  //       setState(lead.state || '')
  //       setAddress(lead.address || '')
  //       setStatus(lead.status || '')
  //       setScore(lead.score || '')
  //       setAssignedTo(lead.assignedTo || '')
  //       setFollowUpDate(lead.followUpDate || null)
  //       setNotes(lead.notes || '')
  //     }
  //   }, [lead, isEditMode]);

  const validate = () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Lead name is required.')
      return false
    }
    // const m = mobile.replace(/\D/g, '')
    // if (!m || m.length !== 10) {
    //   Alert.alert('Validation', 'Mobile number is required and must be 10 digits.')
    //   return false
    // }
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
      age,
      mobile,
      email,
      source,
      leadType,
      city,
      // state,
      // address,
      status,
      score,
      refferedBy,
      followUpDate,
      category,
      specialization,
      prescriptionImage,
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

  const handlePrescriptionImage = async () => {
    const img = await PickImageComponent()
    console.log('Prescription Image:', img)
    if (img) {
      setPrescriptionImage(img.uri)
    }
  }

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation && navigation.goBack()} style={styles.headerLeft}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={Colors.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{isEditMode ? 'Edit Lead Patient' : 'Add New Lead Patient'}</Text>

        <TouchableOpacity onPress={handleSaveLead} style={styles.headerRight}>
          <MaterialCommunityIcons name="content-save" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Basic Information */}
          <Text style={[styles.sectionTitle, {marginBottom:0}]}>Basic Information</Text>

          <CustomDropDown iconName="category" uprLabel="Lead Type" value={leadType} setValue={setLeadType} data={TYPE_OPTIONS} />
          <CustomInput
            label="Patient Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter patient name"
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
          <CustomDateTimePicker
            placeholder="Date"
            value={date}
            setDate={setDate}
            iconName="calendar-today"
            mode="date"
            editable={true}
          />
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: responsiveWidth(2) }}>
               <CustomInput
                  label="Age"
                  value={age}
                  onChangeText={(t) => setAge(t.replace(/[^0-9]/g, ''))}
                  placeholder="Enter age"
                  keyboardType="numeric"
                  maxLength={3}
                  icon="cake"
                />
            </View>
            <View style={{ flex: 1, marginLeft: responsiveWidth(2) }}>
              <CustomDropDown iconName="location-city" uprLabel="City" value={city} setValue={setCity} data={CITY_OPTIONS} />
            </View>
          </View>

          {/* Lead Details */}
          <Text style={styles.sectionTitle}>Lead Details</Text>
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: responsiveWidth(2) }}>
              <CustomDropDown iconName="source" uprLabel="Lead Source" value={source} setValue={setSource} data={SOURCE_OPTIONS} />
            </View>
            <View style={{ flex: 1, marginLeft: responsiveWidth(2) }}>
              <CustomDropDown iconName="supervisor-account" search={true} uprLabel="Reffered by" value={refferedBy} setValue={setRefferedBy} data={REFFERED_BY_OPTIONS} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: responsiveWidth(2) }}>
              <CustomDropDown iconName="category" uprLabel="Category" value={category} setValue={setCategory} data={CATEGORY_OPTIONS} />
            </View>
            <View style={{ flex: 1, marginLeft: responsiveWidth(2) }}>
              <CustomDropDown iconName="medical-services" uprLabel="Specialization" value={specialization} setValue={setSpecialization} data={SPECIALIZATION_OPTIONS} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: responsiveWidth(2) }}>
              <CustomDropDown iconName="flag" uprLabel="Status" value={status} setValue={setStatus} data={STATUS_OPTIONS} />
            </View>
            <View style={{ flex: 1, marginLeft: responsiveWidth(2) }}>
              <CustomDropDown iconName="whatshot" uprLabel="Lead Score" value={score} setValue={setScore} data={SCORE_OPTIONS} />
            </View>
          </View>

          <CustomDateTimePicker
            placeholder="Next follow-up"
            value={followUpDate}
            setDate={setFollowUpDate}
            iconName="calendar-today"
            mode="date"
          />

          {/* Prescription Image */}
          <Text style={styles.sectionTitle}>Prescription</Text>
          <TouchableOpacity style={styles.uploadBox} onPress={handlePrescriptionImage}>
            {prescriptionImage ? (
              <>
                <Image source={{ uri: prescriptionImage }} style={styles.previewImage} resizeMode='cover' />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setPrescriptionImage(null)}
                >
                  <MaterialIcons name="close" size={responsiveFontSize(2)} color={Colors.deleteButton} />
                  <Text style={styles.removeImageText}>Remove</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <MaterialIcons name="file-upload" size={responsiveFontSize(3)} color={Colors.primary} />
                <Text style={styles.uploadText}>Tap to Upload Prescription</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Notes */}
          <Text style={styles.sectionTitle}>Notes / Comments</Text>
          <CustomInput label="Notes" value={notes} onChangeText={setNotes} placeholder="Enter additional notes or comments" icon="note" />

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <CustomButton title={isEditMode ? 'Save Changes' : 'Add Lead Patient'} onPress={handleSaveLead} isLoading={loading} />
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

  container: { padding: responsiveWidth(4), paddingBottom: responsiveHeight(6), gap: responsiveHeight(1.5) },

  sectionTitle: { fontSize: responsiveFontSize(1.6), fontWeight: '700', color: Colors.textPrimary, marginTop: responsiveHeight(1), },

  row: { flexDirection: 'row', alignItems: 'center', marginBottom: responsiveHeight(1) },

  buttonRow: { marginTop: responsiveHeight(2), gap: responsiveWidth(2) },
  cancelBtn: { marginLeft: responsiveWidth(3), paddingVertical: responsiveHeight(1.4), paddingHorizontal: responsiveWidth(4), borderRadius: responsiveWidth(6), borderWidth: 1, borderColor: Colors.primary },
  cancelText: { color: Colors.primary, fontWeight: '700', fontSize: responsiveFontSize(1.6) },

  uploadBox: {
    borderWidth: 1,
    borderColor: Colors.primaryWithExtraOpacity,
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
    minHeight: responsiveHeight(10),
    borderStyle: 'dashed',
    backgroundColor: Colors.primaryWithExtraOpacity,
  },
  previewImage: {
    width: '100%',
    height: responsiveHeight(18),
  },
  removeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: responsiveHeight(0.8),
    borderTopWidth: 1,
    borderTopColor: Colors.primaryWithExtraOpacity,
    borderStyle: 'dashed'
  },
  removeImageText: {
    fontSize: responsiveFontSize(1.4),
    color: Colors.error,
    marginLeft: responsiveWidth(1),
    fontWeight: '500',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveHeight(4),
  },
  uploadText: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.primary,
    marginTop: responsiveHeight(1),
    fontWeight: '600',
  },
})
