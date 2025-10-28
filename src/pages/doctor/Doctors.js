import React, { useState, useEffect, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import MaterialIcons from '@react-native-vector-icons/material-icons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MyHeader from '../../components/MyHeader'
import Colors from '../../style/Colors'
import { Searchbar } from 'react-native-paper'


const mockDoctors = [
  {
    id: 'd1',
    name: 'Dr. Anill Mehta',
    specialization: 'Cardiologist',
    hospitalName: 'City Heart Clinic',
    city: 'Raipur',
    state: 'Chhattisgarh',
    category: 'A',
    hospitalType: 'private',
    mobile: '9876543210',
    avatar: 'https://i.pravatar.cc/120?img=2',
    dateAdded: '10-09-2025',
  },
  {
    id: 'd2',
    name: 'Dr. Shweta Sharma',
    specialization: 'Dermatologist',
    hospitalName: 'Skin Care Center',
    city: 'Bilaspur',
    state: 'Chhattisgarh',
    category: 'B',
    hospitalType: 'govt',
    mobile: '9123456780',
    avatar: 'https://i.pravatar.cc/120?img=5',
    dateAdded: '18-09-2025',
  },
  {
    id: 'd3',
    name: 'Dr. Rajiv Patel',
    specialization: 'Neurologist',
    hospitalName: 'Neuro Health',
    city: 'Durg',
    state: 'Chhattisgarh',
    category: 'A',
    hospitalType: 'corporate',
    mobile: '9012345678',
    avatar: 'https://i.pravatar.cc/120?img=7',
    dateAdded: '01-10-2025',
  },
  {
    id: 'd4',
    name: 'Dr. Rajiv Dixhit',
    specialization: 'Neurologist',
    hospitalName: 'Neuro Health',
    city: 'Durg',
    state: 'Chhattisgarh',
    category: 'C',
    hospitalType: 'corporate',
    mobile: '9012345678',
    avatar: 'https://i.pravatar.cc/120?img=8',
    dateAdded: '25-10-2025',
  },
  {
    id: 'd5',
    name: 'Dr. Rakhi Patel',
    specialization: 'Neurologist',
    hospitalName: 'Neuro Health',
    city: 'Durg',
    state: 'Chhattisgarh',
    category: 'A',
    hospitalType: 'corporate',
    mobile: '9012345678',
    avatar: 'https://i.pravatar.cc/120?img=9',
    dateAdded: '01-10-2025',
  },
  {
    id: 'd6',
    name: 'Dr. Ravi Patel',
    specialization: 'Neurologist',
    hospitalName: 'Neuro Health',
    city: 'Durg',
    state: 'Chhattisgarh',
    category: 'B',
    hospitalType: 'corporate',
    mobile: '9012345678',
    avatar: 'https://i.pravatar.cc/120?img=10',
    dateAdded: '01-10-2025',
  }
  // add more mock items as needed
]

const cityOptions = [
  { label: 'All', value: '' },
  { label: 'Raipur', value: 'Raipur' },
  { label: 'Bilaspur', value: 'Bilaspur' },
  { label: 'Durg', value: 'Durg' },
]

const specializationOptions = [
  { label: 'All', value: '' },
  { label: 'Cardiologist', value: 'Cardiologist' },
  { label: 'Dermatologist', value: 'Dermatologist' },
  { label: 'Neurologist', value: 'Neurologist' },
  { label: 'Pediatrician', value: 'Pediatrician' },
]

const categoryOptions = [
  { label: 'All', value: '' },
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
]

const hospitalTypeOptions = [
  { label: 'All', value: '' },
  { label: 'Private', value: 'private' },
  { label: 'Govt', value: 'govt' },
  { label: 'Corporate', value: 'corporate' },
]

const sortOptions = [
  { label: 'Name A–Z', value: 'name_asc' },
  { label: 'Date Added (newest)', value: 'date_desc' },
  { label: 'Category', value: 'category' },
]


const Doctors = ({ navigation }) => {
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    // search & filters
    const [searchText, setSearchText] = useState('')
    const [filterCity, setFilterCity] = useState('')
    const [filterSpec, setFilterSpec] = useState('')
    const [filterCategory, setFilterCategory] = useState('')
    const [filterHospitalType, setFilterHospitalType] = useState('')
    const [sortBy, setSortBy] = useState(sortOptions[0].value)

    useEffect(() => {
        // simulate api fetch
        setLoading(true)
        const t = setTimeout(() => {
          setDoctors(mockDoctors)
          setLoading(false)
        }, 600)
        return () => clearTimeout(t)
    }, [])
    
    const onRefresh = () => {
        setRefreshing(true)
        // simulate refresh
        setTimeout(() => {
          setDoctors(mockDoctors) // in real app re-fetch
          setRefreshing(false)
        }, 800)
    }
    
    const clearFilters = () => {
        setSearchText('')
        setFilterCity('')
        setFilterSpec('')
        setFilterCategory('')
        setFilterHospitalType('')
        setSortBy(sortOptions[0].value)
    }
    
    const handleDelete = (id) => {
        Alert.alert('Delete', 'Are you sure you want to delete this doctor?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              setDoctors((prev) => prev.filter((d) => d.id !== id))
            },
          },
        ])
    }
    
    const handleViewDetails = (item) => {
        console.log('View Details:', item)
        if (navigation) navigation.navigate('ViewDoctorDetails', { doctor: item })
    }
    
    const handleEdit = (item) => {
        if (navigation) navigation.navigate('EditDoctor', { doctor: item })
    }
    
    const filteredDoctors = useMemo(() => {
        let list = [...doctors]
        if (searchText.trim()) {
          const q = searchText.toLowerCase()
          list = list.filter(
            (d) =>
              d.name.toLowerCase().includes(q) ||
              (d.mobile && d.mobile.includes(q)) ||
              (d.hospitalName && d.hospitalName.toLowerCase().includes(q))
          )
        }
        if (filterCity) list = list.filter((d) => d.city === filterCity)
        if (filterSpec) list = list.filter((d) => d.specialization === filterSpec)
        if (filterCategory) list = list.filter((d) => d.category === filterCategory)
        if (filterHospitalType) list = list.filter((d) => d.hospitalType === filterHospitalType)
    
        if (sortBy === 'name_asc') {
          list.sort((a, b) => a.name.localeCompare(b.name))
        } else if (sortBy === 'date_desc') {
          list.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
        } else if (sortBy === 'category') {
          list.sort((a, b) => a.category.localeCompare(b.category))
        }
        return list
    }, [doctors, searchText, filterCity, filterSpec, filterCategory, filterHospitalType, sortBy])

    const renderDoctorCard = ({ item }) =>{
        return (
        <View style={styles.card}>
          <View style={styles.cardLeft}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          </View>
          <View style={styles.cardBody}>
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={[styles.badge, item.category === 'A' ? styles.badgeA : item.category === 'B' ? styles.badgeB : styles.badgeC]}>
                <Text style={styles.badgeText}>{item.category}</Text>
              </View>
            </View>
            <Text style={styles.subText}>{item.specialization} • {item.hospitalName}</Text>
            <Text style={styles.metaText}>{item.city} • {item.hospitalType}</Text>
            <Text style={styles.mobileText}>📞 {item.mobile}</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleViewDetails(item)}>
                <MaterialIcons name="visibility" size={18} color={Colors.primary} />
                <Text style={styles.actionLabel}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(item)}>
                <MaterialIcons name="edit" size={18} color={Colors.primary} />
                <Text style={styles.actionLabel}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id)}>
                <MaterialIcons name="delete" size={18} color={Colors.secondary} />
                <Text style={[styles.actionLabel, { color: Colors.secondary }]}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => console.log('Open map for', item.name)}>
                <MaterialIcons name="my-location" size={18} color={Colors.info} />
                <Text style={styles.actionLabel}>Map</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    )}
    
    if (loading) {
        return (
          <View style={styles.centered}>
            <ActivityIndicator size="small" color={Colors.primary} />
          </View>
        )
    }


  return (
    <View style={styles.container}>
      {/* <MyHeader
        title={`Doctor List (${filteredDoctors.length})`}
        // onBackPress={()=> navigation.goBack()}
        // onFabPress={() => navigation && navigation.navigate('AddDoctor')}
        // fabTitle="Add"
      /> */}
      <View style={styles.header}>
        <Text style={{color: Colors.white, fontSize: responsiveFontSize(2.2), fontWeight: '700'}}>Doctors</Text>
        <View style={{flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => {}} style={[{padding: responsiveWidth(2)}]}>
            <MaterialCommunityIcons name="magnify" size={responsiveFontSize(2.5)} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={[{ marginLeft: responsiveWidth(1), padding: responsiveWidth(2) }]}>
            <MaterialCommunityIcons name="filter-variant" size={responsiveFontSize(2.5)} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      {/* <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white, paddingVertical: responsiveHeight(1)}}>
        <Text style={{fontWeight: 'bold', fontSize: responsiveFontSize(2), color: Colors.primary}}>Doctors List</Text>
      </View> */}
      <View style={styles.content}>
        {/* Search & Filters */}
        <View style={styles.searchRow}>
            <Searchbar
                placeholder="Search here..."
                value={searchText}
                onChangeText={setSearchText}
                style={styles.searchBar}
                inputStyle={styles.searchInput}
                iconColor={Colors.textSecondary}
                placeholderTextColor={Colors.textSecondary}
                icon={() => <MaterialIcons name="search" size={22} color={Colors.textSecondary} />}
                clearIcon={searchText ? () => <MaterialIcons name="close" size={22} color={Colors.textSecondary} /> : null}
            />
        </View>

        {/* <View style={styles.filterRow}>
          <CustomDropDown uprLabel="City" value={filterCity} setValue={setFilterCity} data={cityOptions} placeholder="City" />
          <CustomDropDown uprLabel="Specialization" value={filterSpec} setValue={setFilterSpec} data={specializationOptions} placeholder="Specialization" />
        </View>

        <View style={styles.filterRow}>
          <CustomDropDown uprLabel="Category" value={filterCategory} setValue={setFilterCategory} data={categoryOptions} placeholder="Category" />
          <CustomDropDown uprLabel="Hospital Type" value={filterHospitalType} setValue={setFilterHospitalType} data={hospitalTypeOptions} placeholder="Hospital Type" />
        </View>

        <View style={styles.filterRow}>
          <CustomDropDown uprLabel="Sort By" value={sortBy} setValue={setSortBy} data={sortOptions} placeholder="Sort" />
          <CustomButton title="Clear Filters" onPress={clearFilters} bgColor={Colors.white} color={Colors.primary} borderC={Colors.primary} />
        </View> */}

        {/* Doctor List */}
        {filteredDoctors.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="medical-services" size={responsiveFontSize(5)} color={Colors.primary} />
            <Text style={styles.emptyText}>No doctors found</Text>
            <Text style={styles.emptySub}>Try clearing filters or add a new doctor.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredDoctors}
            keyExtractor={(item) => item.id}
            renderItem={renderDoctorCard}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={{ paddingBottom: responsiveHeight(12) }}
            ItemSeparatorComponent={() => <View style={{ height: responsiveHeight(1) }} />}
          />
        )}

        {/* Floating Add FAB */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation && navigation.navigate('AddDoctor')}
        >
          <MaterialIcons name="add" size={28} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Doctors


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    height: responsiveHeight(8),
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    elevation: 2,
  },
  content: { flex: 1, paddingHorizontal: responsiveWidth(3), paddingTop: responsiveHeight(1) },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  searchRow: { marginBottom: responsiveHeight(1), marginHorizontal: responsiveWidth(1) },
  searchBar: {
    backgroundColor: Colors.white,
    borderRadius: responsiveWidth(3),
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: responsiveHeight(4.5), // 👈 reduce height
    justifyContent: 'center', // 👈 center content
    paddingVertical: 0,
  },
  searchInput: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.black,
    fontWeight: '600',
    paddingBottom: 0,
    paddingTop: 0,
    textAlignVertical: 'center', // 👈 centers text on Android
    minHeight: responsiveHeight(4), // 👈 ensure input doesn't grow too tall
  },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', gap: responsiveWidth(2), marginBottom: responsiveHeight(1) },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: responsiveWidth(3),
    elevation: 2,
    alignItems: 'flex-start',
  },
  cardLeft: { marginRight: responsiveWidth(3) },
  avatar: { width: responsiveWidth(16), height: responsiveWidth(16), borderRadius: responsiveWidth(8), backgroundColor: '#eee' },
  cardBody: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: responsiveHeight(0.5) },
  name: { fontSize: responsiveFontSize(1.9), fontWeight: '700', color: Colors.textPrimary, flex: 1 },
  subText: { color: Colors.textSecondary, fontSize: responsiveFontSize(1.4), marginBottom: responsiveHeight(0.3) },
  metaText: { color: Colors.textTertiary, fontSize: responsiveFontSize(1.3), marginBottom: responsiveHeight(0.6) },
  mobileText: { color: Colors.textSecondary, fontSize: responsiveFontSize(1.4), marginBottom: responsiveHeight(0.6) },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: Colors.white, fontWeight: '700' },
  badgeA: { backgroundColor: '#16a34a' },
  badgeB: { backgroundColor: '#f59e0b' },
  badgeC: { backgroundColor: '#ef4444' },
  actionRow: { flexDirection: 'row', marginTop: responsiveHeight(0.5), gap: responsiveWidth(3) },
  actionBtn: { flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(4) },
  actionLabel: { marginLeft: 6, color: Colors.textSecondary, fontSize: responsiveFontSize(1.3) },
  emptyState: { alignItems: 'center', marginTop: responsiveHeight(8) },
  emptyText: { marginTop: responsiveHeight(2), fontSize: responsiveFontSize(1.8), color: Colors.textSecondary, fontWeight: '600' },
  emptySub: { marginTop: responsiveHeight(0.6), color: Colors.textTertiary },
  fab: {
    position: 'absolute',
    right: responsiveWidth(6),
    bottom: responsiveHeight(4),
    backgroundColor: Colors.primary,
    width: responsiveWidth(14),
    height: responsiveWidth(14),
    borderRadius: responsiveWidth(7),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
})