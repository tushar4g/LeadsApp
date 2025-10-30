import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CustomButton from '../../components/CustomButton'
import CustomInput from '../../components/CustomInput'
import CustomDropDown from '../../components/CustomDropDown'
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

const LeadActivityItem = ({ item }) => (
  <View style={styles.activityRow}>
    <View style={styles.activityLeft}>
      <MaterialCommunityIcons
        name={item.type === 'Call' ? 'phone' : item.type === 'Visit' ? 'map-marker-radius' : 'message-text-outline'}
        size={20}
        color={Colors.primary}
      />
    </View>
    <View style={styles.activityBody}>
      <Text style={styles.activityType}>{item.type} • {item.date}</Text>
      <Text style={styles.activityNote}>{item.note}</Text>
    </View>
  </View>
)

const ViewLeadDetails = ({ route, navigation }) => {
  const lead = route?.params?.lead ?? {
    id: '1',
    name: 'Dr. Rohan Mehta',
    mobile: '9876543210',
    email: 'rohan.mehta@gmail.com',
    source: 'Hospital',
    status: 'Follow-up',
    city: 'Mumbai',
    address: '23, MG Road',
    notes: 'Interested in partnership for health camps',
    score: 85,
    createdAt: '2025-10-15',
    followUpDate: '2025-10-20',
    assignedTo: 'Tushar Sahu',
    activities: [
      { id: 'a1', type: 'Call', date: '2025-10-12', note: 'Initial contact' },
      { id: 'a2', type: 'Visit', date: '2025-10-14', note: 'Meeting scheduled' },
    ],
  }

  const [loading, setLoading] = useState(false)
  const [convertModalVisible, setConvertModalVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleEdit = () => {
    if (navigation) navigation.navigate('AddLead', { lead })
  }

  const handleDelete = () => {
    Alert.alert('Delete Lead', 'Are you sure you want to delete this lead?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setDeleting(true)
          // simulate delete
          setTimeout(() => {
            setDeleting(false)
            console.log('Deleted lead:', lead.id)
            if (navigation) navigation.goBack()
          }, 700)
        },
      },
    ])
  }

  const handleConvert = (to) => {
    setConvertModalVisible(false)
    // navigate to AddDoctor/AddPatient with prefilled lead
    if (to === 'Doctor') {
      navigation && navigation.navigate('AddDoctor', { prefill: lead })
    } else {
      navigation && navigation.navigate('AddPatient', { prefill: lead })
    }
  }

//   const activities = useMemo(() => lead.activities ?? [], [lead])
    const activities = useMemo(() => {
        if (lead.activities && Array.isArray(lead.activities)) {
            return lead.activities
        }

        // fallback for missing data
        return [
            { id: 'a1', type: 'Call', date: '2025-10-12', note: 'Initial contact' },
            { id: 'a2', type: 'Visit', date: '2025-10-14', note: 'Meeting scheduled' },
            { id: 'a3', type: 'Call', date: '2025-10-12', note: 'Initial contact' },
            { id: 'a4', type: 'Visit', date: '2025-10-14', note: 'Meeting scheduled' },
        ]
    }, [lead])


  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    )
  }

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation && navigation.goBack()} style={styles.headerLeft}>
          <MaterialCommunityIcons name="arrow-left" size={responsiveFontSize(2.5)} color={Colors.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Lead Details</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleEdit} style={styles.iconBtn}>
            <MaterialCommunityIcons name="pencil" size={responsiveFontSize(2.2)} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            Alert.alert('Actions', '', [
              // { text: 'Delete', style: 'destructive', onPress: handleDelete },
              { text: 'Convert', onPress: () => setConvertModalVisible(true) },
              { text: 'Cancel', style: 'cancel' },
            ])
          }} style={styles.iconBtn}>
            <MaterialCommunityIcons name="dots-vertical" size={responsiveFontSize(2.2)} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Image
              source={ lead.avatar ? { uri: lead.avatar } : null }
              style={styles.avatar}
              // show icon fallback if no avatar
            />
            {!lead.avatar && <MaterialCommunityIcons name="account-circle" size={responsiveFontSize(11)} color={Colors.gray} style={styles.avatarIcon} />}
          </View>

          <Text style={styles.leadName}>{lead.name}</Text>

          <View style={styles.badgeRow}>
            <View style={[styles.sourceBadge]}>
              <Text style={styles.sourceBadgeText}>{lead.source} Lead</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColor(lead.status) }]}>
              <Text style={styles.statusText}>{lead.status}</Text>
            </View>
            {typeof lead.score === 'number' && (
              <View style={styles.scoreWrap}>
                <MaterialCommunityIcons name="star" size={16} color={Colors.orange} />
                <Text style={styles.scoreText}>{lead.score}%</Text>
              </View>
            )}
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="phone" size={18} color={Colors.primary} />
            <View style={styles.infoBody}>
              <Text style={styles.infoLabel}>Mobile</Text>
              <Text style={styles.infoValue}>{lead.mobile || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="email" size={18} color={Colors.primary} />
            <View style={styles.infoBody}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{lead.email || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="city" size={18} color={Colors.primary} />
            <View style={styles.infoBody}>
              <Text style={styles.infoLabel}>City</Text>
              <Text style={styles.infoValue}>{lead.city || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={18} color={Colors.primary} />
            <View style={styles.infoBody}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{lead.address || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Lead Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Lead Details</Text>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="tag" size={18} color={Colors.primary} />
            <View style={styles.infoBody}>
              <Text style={styles.infoLabel}>Source</Text>
              <Text style={styles.infoValue}>{lead.source || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar-plus" size={18} color={Colors.primary} />
            <View style={styles.infoBody}>
              <Text style={styles.infoLabel}>Created On</Text>
              <Text style={styles.infoValue}>{lead.createdAt || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={18} color={Colors.primary} />
            <View style={styles.infoBody}>
              <Text style={styles.infoLabel}>Next Follow-up</Text>
              <Text style={styles.infoValue}>{lead.followUpDate || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account" size={18} color={Colors.primary} />
            <View style={styles.infoBody}>
              <Text style={styles.infoLabel}>Assigned To</Text>
              <Text style={styles.infoValue}>{lead.assignedTo || 'Unassigned'}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notes</Text>
          <Text style={[styles.notesText, !lead.notes && styles.notesEmpty]}>{lead.notes || 'No notes added.'}</Text>
        </View>

        {/* Activity History */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.cardTitle}>Activity History</Text>
            <TouchableOpacity onPress={() => navigation && navigation.navigate('AddActivity', { leadId: lead.id })} style={{backgroundColor: Colors.primary, paddingHorizontal: responsiveWidth(2.5), paddingVertical: responsiveHeight(0.5), borderRadius: responsiveWidth(4)}}>
              <Text style={{color: Colors.white, fontWeight: '700'}}>Add Activity</Text>
            </TouchableOpacity>
          </View>
          {/* <Text style={styles.cardTitle}>Activity History</Text> */}

          {activities.length === 0 ? (
            <Text style={styles.notesEmpty}>No activity yet.</Text>
          ) : (
            <FlatList
              data={activities}
              keyExtractor={(i) => i.id || i.date}
              renderItem={({ item }) => <LeadActivityItem item={item} />}
              ItemSeparatorComponent={() => <View style={styles.smallDivider} />}
              scrollEnabled={false} 
            />
          )}

          {/* <View style={{ marginTop: responsiveHeight(1) }}>
            <CustomButton title="Add Activity" onPress={() => navigation && navigation.navigate('AddActivity', { leadId: lead.id })} bgColor={Colors.primary} color={Colors.white} />
          </View> */}
        </View>

        {/* Bottom Actions */}
        <View style={styles.actionsRow}>
            <View style={{ flex: 1 }}>
                <CustomButton title="Edit Lead" onPress={handleEdit} bgColor={Colors.primary} color={Colors.white} />
            </View>
            <View style={{ flex: 1 }}>
                <CustomButton title="Convert Lead" onPress={() => setConvertModalVisible(true)} bgColor={Colors.white} color={Colors.primary} borderC={Colors.primary} />
            </View>
        </View>

        {/* <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete Lead</Text>
        </TouchableOpacity> */}

        <View style={{ height: responsiveHeight(6) }} />
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

export default ViewLeadDetails

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
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { paddingHorizontal: responsiveWidth(2) },

  container: { padding: responsiveWidth(3), paddingBottom: responsiveHeight(6) },

  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: responsiveWidth(4),
    alignItems: 'center',
    marginBottom: responsiveHeight(1.2),
    elevation: 1,
  },
  avatarWrap: { marginBottom: responsiveHeight(1), },
  avatar: { width: responsiveWidth(22), height: responsiveWidth(22), borderRadius: responsiveWidth(11), },
  avatarIcon: { position: 'absolute', top: 0, left: 0 },
  leadName: { fontSize: responsiveFontSize(2), fontWeight: '800', color: Colors.textPrimary, marginBottom: responsiveHeight(0.5) },

  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: responsiveWidth(2) },
  sourceBadge: { backgroundColor: Colors.card6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, marginRight: responsiveWidth(2) },
  sourceBadgeText: { color: Colors.textPrimary, fontWeight: '700' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, marginRight: responsiveWidth(2) },
  statusText: { color: Colors.white, fontWeight: '700' },
  scoreWrap: { flexDirection: 'row', alignItems: 'center' },
  scoreText: { marginLeft: 6, fontWeight: '700', color: Colors.textPrimary },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(1.2),
    elevation: 1,
  },
  cardTitle: { fontSize: responsiveFontSize(1.6), fontWeight: '700', color: Colors.textPrimary, marginBottom: responsiveHeight(0.8) },

  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: responsiveHeight(0.6) },
  infoBody: { marginLeft: responsiveWidth(3), flex: 1 },
  infoLabel: { fontSize: responsiveFontSize(1.1), color: Colors.textSecondary },
  infoValue: { fontSize: responsiveFontSize(1.4), color: Colors.textPrimary, marginTop: responsiveHeight(0.2), fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: responsiveHeight(0.4) },

  notesText: { color: Colors.textPrimary, fontSize: responsiveFontSize(1.4) },
  notesEmpty: { fontStyle: 'italic', color: Colors.textTertiary },

  activityRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: responsiveHeight(0.8) },
  activityLeft: { width: responsiveWidth(10), alignItems: 'center' },
  activityBody: { flex: 1 },
  activityType: { fontWeight: '700', color: Colors.textPrimary },
  activityNote: { color: Colors.textSecondary, marginTop: responsiveHeight(0.3) },
  smallDivider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: responsiveHeight(0.4) },

  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: responsiveWidth(2), marginTop: responsiveHeight(1) },
  deleteBtn: { marginTop: responsiveHeight(1.2), alignItems: 'center' },
  deleteText: { color: Colors.secondary, fontWeight: '700' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: Colors.white, padding: responsiveWidth(4), borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  modalTitle: { fontSize: responsiveFontSize(1.6), fontWeight: '700', marginBottom: responsiveHeight(1) },
  convertOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: responsiveHeight(1) },
  convertLabel: { marginLeft: responsiveWidth(3), fontSize: responsiveFontSize(1.4), color: Colors.textPrimary },
  modalClose: { marginTop: responsiveHeight(1), alignItems: 'center' },
  modalCloseText: { color: Colors.primary, fontWeight: '700' },

  loadingOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.6)' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})