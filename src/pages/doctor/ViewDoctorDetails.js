import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import MaterialIcons from '@react-native-vector-icons/material-icons'
import CustomButton from '../../components/CustomButton'
import Colors from '../../style/Colors'

const ViewDoctorDetails = ({ route, navigation }) => {
  const doctor = route?.params?.doctor ?? {
    id: 'd0',
    name: 'Dr. Unknown',
    specialization: 'N/A',
    hospital: 'N/A',
    contact: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    qualification: '',
    experience: '',
    fee: '',
    area: '',
    notes: '',
    referralCode: '',
    avatar: 'https://i.pravatar.cc/150?img=12',
    verified: false,
  }

  const handleEdit = () => {
    if (navigation) navigation.navigate('EditDoctor', { doctor })
  }

  const handleDelete = () => {
    Alert.alert('Delete Doctor', 'Are you sure you want to delete this doctor?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          console.log('Deleted doctor:', doctor.id)
          // TODO: dispatch delete or call API
          if (navigation) navigation.goBack()
        },
      },
    ])
  }

  const handleCall = () => {
    console.log('Call:', doctor.contact)
    // integrate react-native-phone-call or Linking.openURL(`tel:${doctor.contact}`)
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation && navigation.goBack()} style={styles.headerLeft}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doctor Details</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.headerRight}>
          <MaterialIcons name="edit" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
          <View style={styles.nameRow}>
            <Text style={styles.name}>{doctor.name}</Text>
            {doctor.verified && (
              <View style={styles.verified}>
                <MaterialIcons name="verified" size={16} color={Colors.white} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
          <Text style={styles.specialty}>{doctor.specialization}</Text>
          <Text style={styles.hospital}>{doctor.hospital}</Text>

          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickBtn} onPress={handleCall}>
              <MaterialIcons name="phone" size={18} color={Colors.white} />
              <Text style={styles.quickLabel}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickBtn, { backgroundColor: Colors.info }]}
              onPress={() => console.log('Open chat / whatsapp', doctor.contact)}
            >
              <MaterialIcons name="chat" size={18} color={Colors.white} />
              <Text style={styles.quickLabel}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>
          <View style={styles.row}>
            <MaterialIcons name="phone" size={18} color={Colors.primary} />
            <View style={styles.col}>
              <Text style={styles.label}>Mobile</Text>
              <Text style={styles.value}>{doctor.contact || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <MaterialIcons name="email" size={18} color={Colors.primary} />
            <View style={styles.col}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{doctor.email || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <MaterialIcons name="location-on" size={18} color={Colors.primary} />
            <View style={styles.col}>
              <Text style={styles.label}>Clinic Address</Text>
              <Text style={styles.value}>{doctor.address || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <MaterialIcons name="location-city" size={18} color={Colors.primary} />
            <View style={styles.col}>
              <Text style={styles.label}>City</Text>
              <Text style={styles.value}>{doctor.city || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <MaterialIcons name="pin" size={18} color={Colors.primary} />
            <View style={styles.col}>
              <Text style={styles.label}>Pincode</Text>
              <Text style={styles.value}>{doctor.pincode || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Professional Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Professional Details</Text>

          <View style={styles.row}>
            <MaterialIcons name="medical-services" size={18} color={Colors.primary} />
            <View style={styles.col}>
              <Text style={styles.label}>Specialization</Text>
              <Text style={styles.value}>{doctor.specialization || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <MaterialIcons name="school" size={18} color={Colors.primary} />
            <View style={styles.col}>
              <Text style={styles.label}>Qualification</Text>
              <Text style={styles.value}>{doctor.qualification || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <MaterialIcons name="schedule" size={18} color={Colors.primary} />
            <View style={styles.col}>
              <Text style={styles.label}>Experience</Text>
              <Text style={styles.value}>{doctor.experience ? `${doctor.experience} yrs` : 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <MaterialIcons name="local-hospital" size={18} color={Colors.primary} />
            <View style={styles.col}>
              <Text style={styles.label}>Hospital / Clinic</Text>
              <Text style={styles.value}>{doctor.hospital || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <MaterialIcons name="attach-money" size={18} color={Colors.primary} />
            <View style={styles.col}>
              <Text style={styles.label}>Consultation Fee</Text>
              <Text style={styles.value}>{doctor.fee ? `₹ ${doctor.fee}` : 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Other Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Other Information</Text>

          <View style={styles.row}>
            <MaterialIcons name="map" size={18} color={Colors.primary} />
            <View style={styles.col}>
              <Text style={styles.label}>Area / Region</Text>
              <Text style={styles.value}>{doctor.area || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <MaterialIcons name="note" size={18} color={Colors.primary} />
            <View style={styles.col}>
              <Text style={styles.label}>Notes</Text>
              <Text style={styles.value}>{doctor.notes || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <MaterialIcons name="label" size={18} color={Colors.primary} />
            <View style={styles.col}>
              <Text style={styles.label}>Referral Code</Text>
              <Text style={styles.value}>{doctor.referralCode || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Bottom Action Buttons */}
        <View style={styles.actions}>
          <CustomButton title="Edit Doctor" onPress={handleEdit} bgColor={Colors.primary} color={Colors.white} />
          <CustomButton title="Delete Doctor" onPress={handleDelete} bgColor={Colors.white} color={Colors.secondary} borderC={Colors.secondary} />
        </View>
      </ScrollView>
    </SafeAreaView>
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
  headerLeft: { padding: 8 },
  headerRight: { padding: 8 },
  headerTitle: { flex: 1, textAlign: 'center', color: Colors.white, fontSize: responsiveFontSize(2), fontWeight: '700' },

  container: { padding: responsiveWidth(4), paddingBottom: responsiveHeight(6) },

  profileCard: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
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
  value: { fontSize: responsiveFontSize(1.4), color: Colors.textPrimary, marginTop: responsiveHeight(0.2) },

  actions: { marginTop: responsiveHeight(2), flexDirection: 'row', justifyContent: 'space-between', gap: responsiveWidth(3) },
})