import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CustomButton from '../../components/CustomButton'
import Colors from '../../style/Colors'

const statusColor = (status) => {
  switch (status) {
    case 'Converted':
      return Colors.success
    case 'Follow-up':
      return Colors.warning
    case 'Lost':
      return Colors.secondary
    default:
      return Colors.primary
  }
}

const ViewLeadDetails = ({ route, navigation }) => {
  const lead = route?.params?.lead ?? {
    id: '1',
    leadType: 'Patient',
    name: 'Dr. Rohan Mehta',
    age: '30',
    mobile: '9876543210',
    city: 'Raipur',
    source: 'Hospital',
    referredBy: 'Dr. Sharma',
    category: 'IPD',
    specialization: 'Cardiology',
    status: 'New',
    notes: 'Interested in partnership for health camps',
    score: 85,
    createdAt: '2025-10-15',
    prescriptionImage:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Prescription_pad.svg/800px-Prescription_pad.svg.png',
  }

  const [loading, setLoading] = useState(false)
  const [convertModalVisible, setConvertModalVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleEdit = () => {
    if (navigation) navigation.navigate('AddLead', { lead })
  }

  const handleConvert = (to) => {
    setConvertModalVisible(false)
    if (to === 'Doctor') navigation.navigate('AddDoctor', { prefill: lead })
    else navigation.navigate('AddPatient', { prefill: lead })
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    )
  }

  return (
    <View style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
          <MaterialCommunityIcons name="arrow-left" size={responsiveFontSize(2.5)} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lead Details</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.headerRight}>
          <MaterialCommunityIcons name="pencil" size={responsiveFontSize(2.2)} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <MaterialCommunityIcons name="account-circle" size={responsiveWidth(22)} color={Colors.gray} />
          <Text style={styles.leadName}>{lead.name}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.sourceBadge}>
              <Text style={styles.sourceBadgeText}>Reffered By: {lead.referredBy}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColor(lead.status) }]}>
              <Text style={styles.statusText}>{lead.status}</Text>
            </View>
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Basic Information</Text>
          <DetailRow icon="account" label="Lead Type" value={lead.leadType} />
          <DetailRow icon="cake" label="Age" value={lead.age ? `${lead.age} years` : 'N/A'} />
          <DetailRow icon="phone" label="Mobile" value={lead.mobile} />
          <DetailRow icon="map-marker" label="City" value={lead.city} />
        </View>

        {/* Lead Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Lead Details</Text>
          <DetailRow icon="tag" label="Lead Source" value={lead.source} />
          <DetailRow icon="medical-bag" label="Specialization" value={lead.specialization} />
          <DetailRow icon="view-list" label="Category" value={lead.category} />
          <DetailRow icon="calendar-plus" label="Created On" value={lead.createdAt} />
        </View>

        {/* Prescription Image */}
        {true ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Prescription Image</Text>
            <Image source={{ uri: 'https://images.pexels.com/photos/2631746/pexels-photo-2631746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }} style={styles.image} resizeMode="contain" />
          </View>
        ) : null}

        {/* Notes */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notes / Comments</Text>
          <Text style={styles.notesText}>{lead.notes || 'No notes added.'}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <View style={{ flex: 1 }}>
            <CustomButton title="Edit Lead" onPress={handleEdit} bgColor={Colors.primary} color={Colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <CustomButton
              title="Convert Lead"
              onPress={() => setConvertModalVisible(true)}
              bgColor={Colors.white}
              color={Colors.primary}
              borderC={Colors.primary}
            />
          </View>
        </View>

        <View style={{ height: responsiveHeight(5) }} />
      </ScrollView>

      {/* Convert Modal */}
      <Modal visible={convertModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Convert Lead To</Text>
            <TouchableOpacity style={styles.convertOption} onPress={() => handleConvert('Doctor')}>
              <MaterialCommunityIcons name="stethoscope" size={20} color={Colors.primary} />
              <Text style={styles.convertLabel}>Doctor</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.convertOption} onPress={() => handleConvert('Patient')}>
              <MaterialCommunityIcons name="account" size={20} color={Colors.primary} />
              <Text style={styles.convertLabel}>Patient</Text>
            </TouchableOpacity>
            <Pressable style={styles.modalClose} onPress={() => setConvertModalVisible(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {deleting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </View>
  )
}

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <MaterialCommunityIcons name={icon} size={responsiveFontSize(2)} color={Colors.textSecondary} />
    <View style={styles.infoBody}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || 'N/A'}</Text>
    </View>
  </View>
)

export default ViewLeadDetails

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    height: responsiveHeight(7),
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(3),
  },
  headerLeft: { padding: 6 },
  headerRight: { padding: 6 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: Colors.white,
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
  },
  container: { padding: responsiveWidth(3), paddingBottom: responsiveHeight(6) },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: responsiveWidth(4),
    alignItems: 'center',
    marginBottom: responsiveHeight(1.2),
    elevation: 1,
  },
  leadName: { fontSize: responsiveFontSize(2), fontWeight: '800', color: Colors.textPrimary, marginTop: 4 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  sourceBadge: { backgroundColor: Colors.card6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
  sourceBadgeText: { color: Colors.textPrimary, fontWeight: '700' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, marginLeft: 8 },
  statusText: { color: Colors.white, fontWeight: '700' },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(1.2),
  },
  cardTitle: { fontSize: responsiveFontSize(1.6), fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: responsiveHeight(0.5) },
  infoBody: { marginLeft: responsiveWidth(4), flex: 1 },
  infoLabel: { fontSize: responsiveFontSize(1.4), color: Colors.textSecondary },
  infoValue: { fontSize: responsiveFontSize(1.6), color: Colors.textPrimary, fontWeight: '600' },
  image: { width: '100%', height: responsiveHeight(25), borderRadius: 8, marginTop: 6 },
  notesText: { fontSize: responsiveFontSize(1.4), color: Colors.textSecondary, lineHeight: 22 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: responsiveWidth(2), marginTop: responsiveHeight(1) },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: Colors.white, padding: responsiveWidth(4), borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  modalTitle: { fontSize: responsiveFontSize(1.6), fontWeight: '700', marginBottom: responsiveHeight(1) },
  convertOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: responsiveHeight(1) },
  convertLabel: { marginLeft: 10, fontSize: responsiveFontSize(1.4), color: Colors.textPrimary },
  modalClose: { marginTop: responsiveHeight(1), alignItems: 'center' },
  modalCloseText: { color: Colors.primary, fontWeight: '700' },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.6)', justifyContent: 'center', alignItems: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})
