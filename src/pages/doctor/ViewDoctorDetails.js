import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
  Linking,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../style/Colors';
import CustomButton from '../../components/CustomButton';

const ViewDoctorDetails = ({ route, navigation }) => {
  const [selectedTab, setSelectedTab] = useState('All Information');

  const doctor = route?.params?.doctor ?? {
    id: 'd0',
    title: 'Dr.',
    name: 'Dr. Unknown',
    gender: 'Male',
    dob: '01-01-1999',
    mobile: '9876543210',
    altMobile: '9876543211',
    email: 'dr.unknown@example.com',
    address: '123 Main Street, Green Park',
    state: 'Chhattisgarh',
    city: 'Raipur',
    pincode: '492001',
    hospitalName: 'City Hospital',
    specialization: 'General Physician',
    hospitaltype: 'Private',
    clinicAddress: '123 Clinic Road, Green Park',
    hospitalNumber: '0771-1234567',
    specializationDetails: 'Internal Medicine and Preventive Care',
    doctorCategory: 'A',
    notes: 'Available only on weekdays',
    clinicPhoto: '',
    verified: true,
    avatar: 'https://i.pravatar.cc/150?img=12',
    referredPatients: [
      {
        id: 'r1',
        name: 'Mr. Ajay Kumar',
        mobile: '9876501234',
        email: 'ajay@example.com',
        leadSource: 'Hospital',
        leadStatus: 'follow up',
        leadScore: 65,
        nextFollowup: '2025-11-10',
        notes: 'Patient to call after reports',
      },
    ],
  };

  const referred = Array.isArray(doctor.referredPatients)
    ? doctor.referredPatients
    : [];

  const handleEdit = () => {
    if (navigation) navigation.navigate('AddDoctor', { doctor });
  };

  const handleDelete = () => {
    Alert.alert('Delete Doctor', 'Are you sure you want to delete this doctor?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          console.log('Deleted doctor:', doctor.id);
          if (navigation) navigation.goBack();
        },
      },
    ]);
  };

  const handleCall = (num) => {
    if (!num) return;
    const tel = `tel:${num}`;
    Linking.canOpenURL(tel).then((supported) => {
      if (supported) Linking.openURL(tel);
      else console.log('Cannot open dialer');
    });
  };

  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.row}>
      <MaterialIcons
        name={icon}
        size={responsiveFontSize(2)}
        color={Colors.primary}
      />
      <View style={styles.col}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || '—'}</Text>
      </View>
    </View>
  );

  const statusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'converted') return Colors.success;
    if (s === 'follow up' || s === 'follow-up' || s === 'followup')
      return Colors.warning;
    return Colors.secondary;
  };

  const renderReferred = ({ item }) => (
    <View style={styles.refItem}>
      <View style={styles.initialCircle}>
        <Text style={styles.initialText}>{item?.name ? item.name.charAt(0).toUpperCase() : '?'}</Text>
      </View>
      <View style={styles.refBody}>
        <View style={styles.refHeader}>
          <Text style={styles.refName}>{item.name || '—'}</Text>
          <View
            style={[
              styles.refBadge,
              { backgroundColor: statusColor(item.leadStatus) },
            ]}
          >
            <Text style={styles.refBadgeText}>
              {(item.leadStatus || 'new').toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.smallText}>
          {item.leadSource
            ? `${item.leadSource} • Score: ${item.leadScore ?? '—'}`
            : `Score: ${item.leadScore ?? '—'}`}
        </Text>

        <View style={styles.rowSmall}>
          <TouchableOpacity onPress={() => handleCall(item.mobile)}>
            <Text style={styles.linkText}>{item.mobile || '—'}</Text>
          </TouchableOpacity>
          <Text
            style={[styles.smallText, { marginLeft: responsiveWidth(3) }]}
          >
            {item.email || '—'}
          </Text>
        </View>

        <View style={styles.rowSmall}>
          <Text style={styles.smallText}>
            Next follow-up:{' '}
            {item.nextFollowup
              ? new Date(item.nextFollowup).toLocaleDateString()
              : '—'}
          </Text>
        </View>

        {item.notes ? (
          <Text style={[styles.smallText, { marginTop: responsiveHeight(0.5) }]}>
            Notes: {item.notes}
          </Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation && navigation.goBack()}
          style={styles.headerLeft}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={responsiveFontSize(2.5)}
            color={Colors.white}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doctor Details</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.headerRight}>
          <MaterialCommunityIcons
            name="pencil"
            size={responsiveFontSize(2.5)}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.profileCard, {marginHorizontal: responsiveWidth(4), marginTop: responsiveHeight(1)}]}>
        <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
        <View style={styles.nameRow}>
          <Text style={styles.name}>
            {(doctor.title ? `${doctor.title} ` : '') + (doctor.name || '—')}
          </Text>
          {doctor?.verified && (
            <View style={styles.verified}>
              <MaterialIcons
                name="verified"
                size={responsiveFontSize(1.3)}
                color={Colors.white}
              />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>
        <Text style={styles.specialty}>{doctor.specialization}</Text>
        <Text style={styles.hospital}>{doctor.hospitalName}</Text>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickBtn}
            onPress={() => handleCall(doctor.mobile)}
          >
            <MaterialIcons
              name="phone"
              size={responsiveFontSize(2)}
              color={Colors.white}
            />
            <Text style={styles.quickLabel}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: Colors.info }]}
          >
            <MaterialIcons
              name="chat"
              size={responsiveFontSize(2)}
              color={Colors.white}
            />
            <Text style={styles.quickLabel}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Custom Top Tabs */}
      <View style={styles.tabCard}>
        {['All Information', 'Referred Patients'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.activeTab,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedTab === 'All Information' ? (
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile */}
          {/* <View style={styles.profileCard}>
            <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
            <View style={styles.nameRow}>
              <Text style={styles.name}>
                {(doctor.title ? `${doctor.title} ` : '') + (doctor.name || '—')}
              </Text>
              {doctor?.verified && (
                <View style={styles.verified}>
                  <MaterialIcons
                    name="verified"
                    size={responsiveFontSize(1.3)}
                    color={Colors.white}
                  />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
            <Text style={styles.specialty}>{doctor.specialization}</Text>
            <Text style={styles.hospital}>{doctor.hospitalName}</Text>

            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.quickBtn}
                onPress={() => handleCall(doctor.mobile)}
              >
                <MaterialIcons
                  name="phone"
                  size={responsiveFontSize(2)}
                  color={Colors.white}
                />
                <Text style={styles.quickLabel}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickBtn, { backgroundColor: Colors.info }]}
              >
                <MaterialIcons
                  name="chat"
                  size={responsiveFontSize(2)}
                  color={Colors.white}
                />
                <Text style={styles.quickLabel}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View> */}

          {/* Info Cards */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Contact Information</Text>
            <InfoRow icon="phone" label="Mobile" value={doctor.mobile} />
            <InfoRow
              icon="phone"
              label="Alternate Mobile"
              value={doctor.altMobile}
            />
            <InfoRow icon="email" label="Email" value={doctor.email} />
            <InfoRow
              icon="location-on"
              label="Clinic Address"
              value={doctor.clinicAddress || doctor.address}
            />
            <InfoRow icon="public" label="State" value={doctor.state} />
            <InfoRow icon="location-city" label="City" value={doctor.city} />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Professional Details</Text>
            <InfoRow
              icon="local-hospital"
              label="Hospital"
              value={doctor.hospitalName}
            />
            <InfoRow
              icon="medical-services"
              label="Hospital Type"
              value={doctor.hospitaltype}
            />
            <InfoRow
              icon="description"
              label="Specialization"
              value={doctor.specialization}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Additional Information</Text>
            <InfoRow icon="note" label="Notes" value={doctor.notes} />
            <InfoRow
              icon="description"
              label="Specialization Details"
              value={doctor.specializationDetails}
            />
          </View>

          <View style={styles.actions}>
            <CustomButton
              title="Edit Doctor"
              onPress={handleEdit}
              bgColor={Colors.primary}
              color={Colors.white}
            />
          </View>
        </ScrollView>
      ) : (
        <View style={[styles.container, { flex: 1 }]}>
          {referred.length === 0 ? (
            <Text style={{ color: Colors.textSecondary, textAlign: 'center', }}>
              No referred patients.
            </Text>
          ) : (
            <FlatList
              data={referred}
              keyExtractor={(i) => i.id || `${i.mobile}-${i.name}`}
              renderItem={renderReferred}
              contentContainerStyle={{gap: responsiveHeight(1)}}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default ViewDoctorDetails;

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
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: Colors.white,
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
  },
  tabCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: responsiveWidth(4),
    marginTop: responsiveHeight(1),
    borderRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    paddingVertical: responsiveHeight(1.2),
    alignItems: 'center',
  },
  tabText: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  activeTabText: {
    color: Colors.white,
    fontWeight: '700',
  },
  container: { padding: responsiveWidth(4), paddingBottom: responsiveHeight(8) },
  profileCard: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: responsiveWidth(2),
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(3),
    // marginBottom: responsiveHeight(2),
    elevation: 2,
  },
  avatar: {
    width: responsiveWidth(28),
    height: responsiveWidth(28),
    borderRadius: responsiveWidth(14),
    marginBottom: responsiveHeight(1),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(0.5),
  },
  name: {
    fontSize: responsiveFontSize(2),
    fontWeight: '800',
    color: Colors.textPrimary,
    marginRight: responsiveWidth(2),
  },
  specialty: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.textSecondary,
    marginBottom: responsiveHeight(0.3),
  },
  hospital: { fontSize: responsiveFontSize(1.4), color: Colors.textTertiary },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: responsiveWidth(1.8),
    paddingVertical: responsiveHeight(0.4),
    borderRadius: responsiveWidth(4),
  },
  verifiedText: {
    color: Colors.white,
    marginLeft: 6,
    fontSize: responsiveFontSize(1.1),
  },
  quickActions: {
    flexDirection: 'row',
    marginTop: responsiveHeight(1),
    gap: responsiveWidth(3),
  },
  quickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(0.6),
    borderRadius: responsiveWidth(2),
    marginHorizontal: responsiveWidth(1),
  },
  quickLabel: { color: Colors.white, marginLeft: 6, fontWeight: '700' },
  card: {
    backgroundColor: Colors.white,
    borderRadius: responsiveWidth(2),
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(1.5),
    elevation: 1,
  },
  cardTitle: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: responsiveHeight(1),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: responsiveHeight(1),
  },
  col: { marginLeft: responsiveWidth(3), flex: 1 },
  label: { fontSize: responsiveFontSize(1.2), color: Colors.textSecondary },
  value: {
    fontSize: responsiveFontSize(1.4),
    color: Colors.textPrimary,
    marginTop: responsiveHeight(0.2),
    fontWeight: '600',
  },
  refItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1),
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    backgroundColor: Colors.white,
    borderRadius: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(2),
  },
  refLeft: {
    width: responsiveWidth(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialCircle: {
    width: responsiveHeight(5),
    height: responsiveHeight(5),
    borderRadius: responsiveHeight(2.5),
    backgroundColor: Colors.primary, // or any accent color
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: responsiveWidth(2),
  },
  initialText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2),
  },
  refBody: { flex: 1, paddingLeft: responsiveWidth(2) },
  refHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  refName: {
    fontWeight: '800',
    color: Colors.textPrimary,
    fontSize: responsiveFontSize(1.1),
  },
  refBadge: {
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(0.25),
    borderRadius: 12,
  },
  refBadgeText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: responsiveFontSize(0.9),
  },
  smallText: {
    color: Colors.textSecondary,
    marginTop: responsiveHeight(0.4),
    fontSize: responsiveFontSize(0.95),
  },
  rowSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(0.4),
  },
  linkText: { color: Colors.primary, fontWeight: '700' },
});
