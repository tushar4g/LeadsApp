import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../../style/Colors'
import CustomButton from '../../components/CustomButton'

const ViewDoctorDetails = ({ route, navigation }) => {
  const doctor = route?.params?.doctor ?? {
    id: 'd0',
    name: 'Dr. Unknown',
    gender: 'Male',
    specialization: 'General Physician',
    department: 'Medicine',
    hospitalName: 'City Hospital',
    mobile: '9876543210',
    email: 'dr.unknown@example.com',
    address: '123 Main Street, Green Park',
    city: 'Mumbai',
    pincode: '400001',
    qualification: 'MBBS, MD',
    experience: '10',
    fee: '500',
    area: 'South Mumbai',
    notes: 'Available only on weekdays',
    referralCode: 'DR2025',
    registrationNumber: 'MH123456',
    availability: 'Mon-Fri, 10AM - 6PM',
    languages: 'English, Hindi, Marathi',
    specializationDetails: 'Internal Medicine and Preventive Care',
    verified: true,
    avatar: 'https://i.pravatar.cc/150?img=12',
  }

  const handleEdit = () => {
    if (navigation) navigation.navigate('AddDoctor', { doctor })
  }

  const handleDelete = () => {
    Alert.alert('Delete Doctor', 'Are you sure you want to delete this doctor?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          console.log('Deleted doctor:', doctor.id)
          if (navigation) navigation.goBack()
        },
      },
    ])
  }

  const handleCall = () => {
    console.log('Calling:', doctor.mobile)
  }

  return (
    <View style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation && navigation.goBack()} style={styles.headerLeft}>
          <MaterialCommunityIcons name="arrow-left" size={responsiveFontSize(2.5)} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doctor Details</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.headerRight}>
          <MaterialCommunityIcons name="pencil" size={responsiveFontSize(2.5)} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile */}
        <View style={styles.profileCard}>
          <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
          <View style={styles.nameRow}>
            <Text style={styles.name}>{doctor.name}</Text>
            {doctor?.verified && (
              <View style={styles.verified}>
                <MaterialIcons name="verified" size={responsiveFontSize(1.3)} color={Colors.white} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
          <Text style={styles.specialty}>{doctor.specialization}</Text>
          <Text style={styles.hospital}>{doctor.hospitalName}</Text>

          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickBtn} onPress={handleCall}>
              <MaterialIcons name="phone" size={responsiveFontSize(2)} color={Colors.white} />
              <Text style={styles.quickLabel}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickBtn, { backgroundColor: Colors.info }]}>
              <MaterialIcons name="chat" size={responsiveFontSize(2)} color={Colors.white} />
              <Text style={styles.quickLabel}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>
          {[
            { icon: 'phone', label: 'Mobile', value: doctor.mobile },
            { icon: 'email', label: 'Email', value: doctor.email },
            { icon: 'location-on', label: 'Clinic Address', value: doctor.address },
            { icon: 'location-city', label: 'City', value: doctor.city },
            { icon: 'pin', label: 'Pincode', value: doctor.pincode },
          ].map((item, idx) => (
            <View style={styles.row} key={idx}>
              <MaterialIcons name={item.icon} size={responsiveFontSize(2)} color={Colors.primary} />
              <View style={styles.col}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value || 'N/A'}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Professional Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Professional Details</Text>
          {[
            { icon: 'medical-services', label: 'Department', value: doctor.department },
            { icon: 'school', label: 'Qualification', value: doctor.qualification },
            { icon: 'schedule', label: 'Experience', value: doctor.experience ? `${doctor.experience} yrs` : 'N/A' },
            { icon: 'local-hospital', label: 'Hospital / Clinic', value: doctor.hospitalName },
            { icon: 'attach-money', label: 'Consultation Fee', value: doctor.fee ? `₹ ${doctor.fee}` : 'N/A' },
            { icon: 'badge', label: 'Registration Number', value: doctor.registrationNumber },
            { icon: 'language', label: 'Languages Known', value: doctor.languages },
            { icon: 'event', label: 'Availability', value: doctor.availability },
          ].map((item, idx) => (
            <View style={styles.row} key={idx}>
              <MaterialIcons name={item.icon} size={responsiveFontSize(2)} color={Colors.primary} />
              <View style={styles.col}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value || 'N/A'}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Additional Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Additional Information</Text>
          {[
            { icon: 'description', label: 'Specialization Details', value: doctor.specializationDetails },
            { icon: 'map', label: 'Area / Region', value: doctor.area },
            { icon: 'note', label: 'Notes', value: doctor.notes },
            { icon: 'label', label: 'Referral Code', value: doctor.referralCode },
          ].map((item, idx) => (
            <View style={styles.row} key={idx}>
              <MaterialIcons name={item.icon} size={responsiveFontSize(2)} color={Colors.primary} />
              <View style={styles.col}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value || 'N/A'}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <CustomButton title="Edit Doctor" onPress={handleEdit} bgColor={Colors.primary} color={Colors.white} />
        </View>
      </ScrollView>
    </View>
  )
}

export default ViewDoctorDetails

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
  headerLeft: { padding: responsiveWidth(1) },
  headerRight: { padding: responsiveWidth(1) },
  headerTitle: { flex: 1, textAlign: 'center', color: Colors.white, fontSize: responsiveFontSize(2), fontWeight: '700' },

  container: { padding: responsiveWidth(4), paddingBottom: responsiveHeight(8) },

  profileCard: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: responsiveWidth(2),
    paddingVertical: responsiveHeight(3),
    paddingHorizontal: responsiveWidth(3),
    marginBottom: responsiveHeight(2),
    elevation: 2,
  },
  avatar: { width: responsiveWidth(28), height: responsiveWidth(28), borderRadius: responsiveWidth(14), marginBottom: responsiveHeight(1) },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: responsiveHeight(0.5) },
  name: { fontSize: responsiveFontSize(2), fontWeight: '800', color: Colors.textPrimary, marginRight: responsiveWidth(2) },
  specialty: { fontSize: responsiveFontSize(1.6), color: Colors.textSecondary, marginBottom: responsiveHeight(0.3) },
  hospital: { fontSize: responsiveFontSize(1.4), color: Colors.textTertiary },
  verified: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.success, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  verifiedText: { color: Colors.white, marginLeft: 6, fontSize: responsiveFontSize(1.1) },

  quickActions: { flexDirection: 'row', marginTop: responsiveHeight(1), gap: responsiveWidth(3) },
  quickBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginHorizontal: 6 },
  quickLabel: { color: Colors.white, marginLeft: 6, fontWeight: '700' },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(1.5),
    elevation: 1,
  },
  cardTitle: { fontSize: responsiveFontSize(1.6), fontWeight: '700', color: Colors.textPrimary, marginBottom: responsiveHeight(1) },

  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: responsiveHeight(1) },
  col: { marginLeft: responsiveWidth(3), flex: 1 },
  label: { fontSize: responsiveFontSize(1.2), color: Colors.textSecondary },
  value: { fontSize: responsiveFontSize(1.4), color: Colors.textPrimary, marginTop: responsiveHeight(0.2), fontWeight: '600' },

  actions: { marginTop: responsiveHeight(2) },
})
