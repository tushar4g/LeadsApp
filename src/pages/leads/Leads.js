// ...existing code...
import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  RefreshControl,
} from 'react-native'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Searchbar } from 'react-native-paper'
import CustomButton from '../../components/CustomButton'
import CustomDropDown from '../../components/CustomDropDown'
import Colors from '../../style/Colors'

const SUMMARY = [
  { key: 'new', label: 'New Leads', count: 24, icon: 'note-plus-outline', color: Colors.lightPrimary },
  { key: 'followup', label: 'Follow-up', count: 12, icon: 'repeat', color: Colors.card2 },
  { key: 'converted', label: 'Converted', count: 8, icon: 'check-circle-outline', color: Colors.card3 },
  { key: 'lost', label: 'Lost', count: 3, icon: 'close-circle-outline', color: Colors.card4 },
]

const STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'New', value: 'New' },
  { label: 'Follow-up', value: 'Follow-up' },
  { label: 'Converted', value: 'Converted' },
  { label: 'Lost', value: 'Lost' },
]

const SOURCE_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Doctor', value: 'Doctor' },
  { label: 'Hospital', value: 'Hospital' },
  { label: 'Corporate', value: 'Corporate' },
  { label: 'Event', value: 'Event' },
  { label: 'Other', value: 'Other' },
]

const CITY_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Raipur', value: 'Raipur' },
  { label: 'Bilaspur', value: 'Bilaspur' },
  { label: 'Durg', value: 'Durg' },
]

const mockLeads = [
  {
    id: 'l1',
    leadType: 'Patient',
    name: 'Rohan Mehta',
    source: 'Doctor',
    referredBy: 'Dr. Anil Kumar',
    status: 'Follow-up',
    mobile: '9876543210',
    nextFollowUp: '08-11-2025',
    notes: 'Interested in premium health checkup package.',
    score: 85,
    createdAt: '12 Oct 2025',
    city: 'Raipur',
    address: '123, MG Road, Raipur',
    assignedTo: 'Tushar',
  },
  {
    id: 'l2',
    name: 'Ms. Priya Singh',
    source: 'Event',
    referredBy: 'Dr. Suman Verma',
    mobile: '9123456780',
    nextFollowUp: '20-10-2025',
    notes: 'Follow-up on health checkup package.',
    status: 'New',
    score: 70,
    createdAt: '15 Oct 2025',
    city: 'Bilaspur',
    address: '456, Park Avenue, Bilaspur',
    assignedTo: 'Amit',
  },
  {
    id: 'l3',
    name: 'Neha Sharma',
    source: 'Hospital',
    referredBy: 'Dr. Rakesh Gupta',
    mobile: '9987654321',
    nextFollowUp: '05-11-2025',
    notes: 'Interested in corporate health packages for staff.',
    status: 'Converted',
    score: 92,
    createdAt: '01 Oct 2025',
    city: 'Durg',
    address: '789, Central Hospital, Durg',
    assignedTo: 'Kiran',
  },
  // ...add more mock items if needed
]

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

const Leads = ({ navigation }) => {
  const [searchText, setSearchText] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSource, setFilterSource] = useState('')
  const [filterCity, setFilterCity] = useState('')
  const [leadList, setLeadList] = useState(mockLeads)
  const [refreshing, setRefreshing] = useState(false)
  const [filterModalVisible, setFilterModalVisible] = useState(false)

  const onRefresh = () => {
    setRefreshing(true)
    // simulate fetch
    setTimeout(() => {
      setLeadList(mockLeads)
      setRefreshing(false)
    }, 800)
  }

  const applySummaryFilter = (key) => {
    if (key === 'new') setFilterStatus('New')
    else if (key === 'followup') setFilterStatus('Follow-up')
    else if (key === 'converted') setFilterStatus('Converted')
    else if (key === 'lost') setFilterStatus('Lost')
  }

  const clearAllFilters = () => {
    setSearchText('')
    setFilterStatus('')
    setFilterSource('')
    setFilterCity('')
  }

  const filteredLeads = useMemo(() => {
    let list = [...leadList]
    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.source.toLowerCase().includes(q) ||
          (l.mobile && l.mobile.includes(q))
      )
    }
    if (filterStatus) list = list.filter((l) => l.status === filterStatus)
    if (filterSource) list = list.filter((l) => l.source.toLowerCase().includes(filterSource.toLowerCase()))
    if (filterCity) list = list.filter((l) => l.city === filterCity)
    return list
  }, [leadList, searchText, filterStatus, filterSource, filterCity])

  const handleDelete = (id) => {
    setLeadList((prev) => prev.filter((p) => p.id !== id))
  }

  const renderSummaryCard = ({ item }) => (
    <TouchableOpacity style={[styles.summaryCard, { backgroundColor: item.color }]} onPress={() => applySummaryFilter(item.key)}>
      <MaterialCommunityIcons name={item.icon} size={22} color={Colors.textPrimary} />
      <Text style={styles.summaryCount}>{item.count}</Text>
      <Text style={styles.summaryLabel}>{item.label}</Text>
    </TouchableOpacity>
  )

  const renderLead = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation && navigation.navigate('ViewLeadDetails', { lead: item })} style={styles.leadCard}>
        {/* Card Header */}
        <View style={styles.leadHeader}>
          <View>
            <Text style={styles.leadName}>{item.name}</Text>
            <Text style={styles.leadSource}>Source: {item.source}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        {/* Meta Info Section */}
        <View style={styles.metaContainer}>
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="account-check-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.metaText}>Referred by: {item.referredBy || 'N/A'}</Text>
          </View>
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="calendar-month-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.metaText}>Date: {item.createdAt}</Text>
          </View>
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="star-circle-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.metaText}>Score: {item.score}%</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.leadActions}>
          <TouchableOpacity onPress={() => navigation && navigation.navigate('ViewLeadDetails', { lead: item })} style={[styles.actionBtn, ]}>
            <MaterialCommunityIcons name="eye-outline" size={16} color={Colors.primary} />
            <Text style={[styles.actionLabel, { color: Colors.primary }]}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation && navigation.navigate('AddLead', { lead: item })} style={[styles.actionBtn, ]}>
            <MaterialCommunityIcons name="pencil-outline" size={16} color={Colors.primary} />
            <Text style={[styles.actionLabel, { color: Colors.primary }]}>Edit</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={{color: Colors.white, fontSize: responsiveFontSize(2.2), fontWeight: '700'}}>Leads</Text>
        <View style={{flexDirection: 'row', alignItems: 'center' }}>
          {/* <TouchableOpacity onPress={() => {}} style={[{padding: responsiveWidth(2)}]}>
            <MaterialCommunityIcons name="magnify" size={responsiveFontSize(2.5)} color={Colors.white} />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={[{ marginLeft: responsiveWidth(1), padding: responsiveWidth(2) }]}>
            <MaterialCommunityIcons name="filter-variant" size={responsiveFontSize(2.5)} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Summary Cards */}
      <View style={[styles.summaryWrap,{padding: responsiveWidth(3)}]}>
        {SUMMARY.map((s) => (
          <View key={s.key} style={styles.summaryCol}>
            {renderSummaryCard({ item: s })}
          </View>
        ))}
      </View>

      {/* Searchbar & quick filter indicators */}
      <View style={[styles.searchWrap,{paddingTop: responsiveWidth(1)}]}>
        <View style={{ flex: 1,  }}>
          <Searchbar
            placeholder="Search leads by name, source, or mobile…"
            onChangeText={setSearchText}
            value={searchText}
            style={styles.searchbar}
            inputStyle={styles.searchInput}
            icon={() => <MaterialCommunityIcons name="magnify" size={responsiveFontSize(2.2)} color={Colors.textSecondary} />}
          />
        </View>
        {/* <TouchableOpacity style={[styles.filterShortBtn,]} onPress={() => setFilterModalVisible(true)}>
          <MaterialCommunityIcons name="filter" size={responsiveFontSize(2.2)} color={Colors.primary} />
        </TouchableOpacity> */}
      </View>

      {/* Active filters summary */}
      {(filterStatus || filterSource || filterCity) && (
        <View style={[styles.activeFiltersRow, {paddingRight: responsiveWidth(4)}]}>
          <Text style={styles.activeText}>{filterStatus ? `Status: ${filterStatus}` : ''} {filterSource ? ` • Source: ${filterSource}` : ''} {filterCity ? ` • City: ${filterCity}` : ''}</Text>
          <TouchableOpacity onPress={clearAllFilters}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}
      

      <FlatList
        ListHeaderComponent={<Text style={styles.sectionTitle}>All Leads</Text>}
        data={filteredLeads}
        keyExtractor={(item) => item.id}
        renderItem={renderLead}
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="database-remove" size={48} color={Colors.gray} />
            <Text style={styles.emptyText}>No leads found</Text>
            <Text style={styles.emptySub}>Try changing filters or add a new lead.</Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal visible={filterModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filters</Text>

            <View style={{gap: responsiveHeight(2)}}>
              <CustomDropDown iconName="fact-check"  uprLabel="Status" value={filterStatus} setValue={setFilterStatus} data={STATUS_OPTIONS} />
              <CustomDropDown iconName="source"  uprLabel="Source" value={filterSource} setValue={setFilterSource} data={SOURCE_OPTIONS} />
              <CustomDropDown iconName="location-city"  uprLabel="City" value={filterCity} setValue={setFilterCity} data={CITY_OPTIONS} />
            </View>

            <View style={[styles.modalActions, {gap: responsiveWidth(2)}]}>
              <View style={{flex:1}}>
                <CustomButton title="Clear" onPress={() => { setFilterStatus(''); setFilterSource(''); setFilterCity('') }} bgColor={Colors.white} color={Colors.primary} borderC={Colors.primary} />
              </View>
              <View style={{flex:1}}>
                <CustomButton title="Apply" onPress={() => setFilterModalVisible(false)} bgColor={Colors.primary} color={Colors.white} />
              </View>
            </View>

            <Pressable style={styles.modalClose} onPress={() => setFilterModalVisible(false)}>
              <MaterialCommunityIcons name="close" size={responsiveFontSize(2.2)} color={Colors.textSecondary} />
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Floating Add Lead FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation && navigation.navigate('AddLead')}>
        <MaterialCommunityIcons name="plus" size={22} color={Colors.white} />
        <Text style={styles.fabLabel}>Add Lead</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Leads

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    height: responsiveHeight(7),
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    elevation: 2,
  },
  container: { paddingHorizontal: responsiveWidth(3), paddingBottom: responsiveHeight(16) },

  summaryWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: responsiveHeight(1), marginHorizontal: responsiveWidth(1), gap: responsiveHeight(1) },
  summaryCol: { width: '23%', padding: responsiveWidth(0),},
  summaryCard: {
    borderRadius: 10,
    padding: responsiveWidth(3),
    minHeight: responsiveHeight(10),
    justifyContent: 'center',
    elevation: 1,
  },
  summaryCount: { fontSize: responsiveFontSize(2.2), fontWeight: '700', marginTop: responsiveHeight(0.5) },
  summaryLabel: { fontSize: responsiveFontSize(1.2), color: Colors.textSecondary, marginTop: responsiveHeight(0.5) },

  searchWrap: {  flexDirection: 'row', alignItems: 'center',marginBottom: responsiveHeight(1), paddingHorizontal: responsiveWidth(4) },
  searchbar: {
    borderRadius: responsiveWidth(8),
    elevation: 2,
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderColor: Colors.primaryWithOpacity,
    borderWidth: 1,
    height: responsiveHeight(4.5),
    justifyContent: 'center', // 👈 center content
    paddingVertical: 0,
  },
  searchInput: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.black,
    fontWeight: '500',
    paddingBottom: 0,
    paddingTop: 0,
    minHeight: responsiveHeight(4),
  },
  filterShortBtn: { marginLeft: responsiveWidth(2), padding: responsiveWidth(2), backgroundColor: Colors.white, borderRadius: 8, elevation: 1 },

  activeFiltersRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',  },
  activeText: { color: Colors.primary, fontSize: responsiveFontSize(1.2), paddingLeft: responsiveWidth(3) },
  clearText: { color: Colors.primary, fontWeight: '700' },

  sectionTitle: { marginTop: responsiveHeight(1), marginBottom: responsiveHeight(1), fontSize: responsiveFontSize(1.6), fontWeight: '700', color: Colors.textPrimary, paddingHorizontal: responsiveWidth(1) },

  leadCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: responsiveWidth(3.5),
    marginBottom: responsiveHeight(1.5),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: responsiveHeight(0.8),
  },
  leadName: { fontSize: responsiveFontSize(1.9), fontWeight: '700', color: Colors.textPrimary },
  leadSource: { fontSize: responsiveFontSize(1.4), color: Colors.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14 },
  statusText: { color: Colors.white, fontWeight: '700', fontSize: responsiveFontSize(1.3) },
  metaContainer: { marginTop: responsiveHeight(0.8), gap: responsiveHeight(0.8) },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { marginLeft: responsiveWidth(2), color: Colors.textSecondary, fontSize: responsiveFontSize(1.4) },
  leadActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: responsiveHeight(0), gap: responsiveWidth(2) },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingVertical: responsiveHeight(0.8),
    paddingHorizontal: responsiveWidth(1),
    borderRadius: 8,
  },
  actionLabel: { marginLeft: responsiveWidth(1.5), fontWeight: '600', fontSize: responsiveFontSize(1.5) },
  viewBtn: { backgroundColor: Colors.lightPrimary },
  editBtn: { backgroundColor: Colors.primary },

  empty: { alignItems: 'center', marginTop: responsiveHeight(12) },
  emptyText: { marginTop: responsiveHeight(2), fontSize: responsiveFontSize(1.6), color: Colors.textSecondary },
  emptySub: { marginTop: responsiveHeight(0.5), color: Colors.textTertiary },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, padding: responsiveWidth(4), borderTopLeftRadius: 12, borderTopRightRadius: responsiveWidth(2), minHeight: responsiveHeight(40) },
  modalTitle: { fontSize: responsiveFontSize(1.8), fontWeight: '700', marginBottom: responsiveHeight(1.5) },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: responsiveHeight(2) },
  modalClose: { position: 'absolute', right: responsiveWidth(4), top: responsiveHeight(1.5) },

  fab: {
    position: 'absolute',
    right: responsiveWidth(4),
    bottom: responsiveHeight(4),
    backgroundColor: Colors.primary,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.2),
    borderRadius: responsiveWidth(6),
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
  },
  fabLabel: { color: Colors.white, marginLeft: responsiveWidth(2), fontWeight: '700' },
})
