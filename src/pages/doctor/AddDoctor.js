import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Image, ToastAndroid, PermissionsAndroid, ActivityIndicator, Linking } from 'react-native'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import  MaterialIcons  from '@react-native-vector-icons/material-icons';
import Geolocation from '@react-native-community/geolocation';
import CustomInput from '../../components/CustomInput'
import CustomDropDown from '../../components/CustomDropDown'
import CustomButton from '../../components/CustomButton'
import PickImageComponent from '../../components/PickImageComponent'
import CustomDateTimePicker from '../../components/CustomDateTimePicker'
import MyHeader from '../../components/MyHeader'
import Colors from '../../style/Colors'

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
]

const stateOptions = [
  { label: 'Chhattisgarh', value: 'chhattisgarh' },
  { label: 'Goa', value: 'goa' },
  { label: 'Gujarat', value: 'gujarat' },
]

const cityOptions = [
  { label: 'Raipur', value: 'Raipur' },
  { label: 'Bilaspur', value: 'Bilaspur' },
  { label: 'Durg', value: 'Durg' },
]

const specializationOptions = [
  { label: 'Cardiologist', value: 'cardiologist' },
  { label: 'Dermatologist', value: 'dermatologist' },
  { label: 'Neurologist', value: 'neurologist' },
  { label: 'Pediatrician', value: 'pediatrician' },
  { label: 'General Physician', value: 'general' },
]

const hospitalTypeOptions = [
  { label: 'Private', value: 'private' },
  { label: 'Govt', value: 'govt' },
  { label: 'Corporate', value: 'corporate' },
]

const sourceTypeOptions = [
  { label: 'Corporate', value: 'corporate' },
  { label: 'Hospital', value: 'hospital' },
  { label: 'Self', value: 'self' },
  { label: 'Reference', value: 'reference' },
]

const leadSourceOptions = [
  { label: 'Walk-in', value: 'walkin' },
  { label: 'Campaign', value: 'campaign' },
  { label: 'Telecall', value: 'telecall' },
  { label: 'Marketing', value: 'marketing' },
]

const doctorCategoryOptions = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
]

const visitingDaysOptions = [
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
  { label: 'Sunday', value: 'sunday' },
]

const formatDateForAPI = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const AddDoctor = ({ navigation, route }) => {
  const doctor = route?.params?.doctor ?? {}
  const isEditMode = !!route.params?.doctor;
  console.log('Doctor:', doctor)


  // Basic Info
  const [profileImage, setProfileImage] = useState(null)
  const [fullName, setFullName] = useState('')
  const [gender, setGender] = useState('')
  const [dob, setDob] = useState('')
  const [mobile, setMobile] = useState('')
  const [altMobile, setAltMobile] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')

  // Professional Details
  const [qualification, setQualification] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [registrationNo, setRegistrationNo] = useState('')
  const [experience, setExperience] = useState('')
  const [designation, setDesignation] = useState('')
  const [hospitalName, setHospitalName] = useState('')
  const [hospitalType, setHospitalType] = useState('')
  const [consultationHours, setConsultationHours] = useState('')
  const [visitingDays, setVisitingDays] = useState([])

  // Clinic / Hospital Details
  const [clinicAddress, setClinicAddress] = useState('')
  const [googleLocation, setGoogleLocation] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [clinicEmail, setClinicEmail] = useState('')
  const [location, setLocation] = useState(null)
  const [loadLocation, setLoadLocation] = useState(false)

  // Reference & Relationship Info
  const [sourceType, setSourceType] = useState('')
  const [referenceName, setReferenceName] = useState('')
  const [leadSource, setLeadSource] = useState('')
  const [doctorCategory, setDoctorCategory] = useState('')
  const [remarks, setRemarks] = useState('')

  // Documents
  const [visitingCard, setVisitingCard] = useState(null)
  const [registrationProof, setRegistrationProof] = useState(null)
  const [clinicPhotos, setClinicPhotos] = useState([])

  useEffect(() => {
    if (isEditMode && doctor) {
      const data = route.params.doctor;
      setProfileImage(data.avatar || null);
      setFullName(data.name || '');
      setGender(data.gender || '');
      setDob(data.dob || '');
      setMobile(data.mobile || '');
      setAltMobile(data.altMobile || '');
      setEmail(data.email || '');
      setAddress(data.address || '');
      setCity(data.city || '');
      setState(data.state || '');
      setPincode(data.pincode || '');

      setQualification(data.qualification || '');
      setSpecialization(data.specialization || '');
      setRegistrationNo(data.registrationNo || '');
      setExperience(data.experience || '');
      setDesignation(data.designation || '');
      setHospitalName(data.hospitalName || '');
      setHospitalType(data.hospitalType || '');
      setConsultationHours(data.consultationHours || '');
      setVisitingDays(data.visitingDays || []);

      setClinicAddress(data.clinic || '');
      setLocation(data.location || null);
      setContactPerson(data.contactPerson || '');
      setContactNumber(data.contactNumber || '');
      setClinicEmail(data.clinicEmail || '');

      setSourceType(data.sourceType || '');
      setReferenceName(data.referenceName || '');
      setLeadSource(data.leadSource || '');
      setDoctorCategory(data.doctorCategory || '');
      setRemarks(data.notes || '');

      setVisitingCard(data.visitingCard || null);
      setRegistrationProof(data.registrationProof || null);
      setClinicPhotos(data.clinicPhotos || []);
    }
  }, [doctor, isEditMode]);

  // Pickers
  const handleProfileImage = async () => {
    const img = await PickImageComponent()
    console.log('Profile Image:', img)
    if (img) setProfileImage(img.uri)
  }
  const handleVisitingCard = async () => {
    const img = await PickImageComponent()
    console.log('Visiting Card:', img)
    if (img) {
      setVisitingCard(img.uri)
    } 
  }
  const handleRegistrationProof = async () => {
    const img = await PickImageComponent()
    if (img) setRegistrationProof(img.uri)
  }
  const handleClinicPhotos = async () => {
    if (clinicPhotos.length >= 5) {
      Alert.alert('Limit Reached', 'You can upload a maximum of 5 clinic photos.');
      return;
    }
    const img = await PickImageComponent();
    console.log('Clinic Photos:', img);

    if (img) {
      setClinicPhotos(prev => [...prev, img.uri].slice(0, 5)); // just a safety limit
    }
  }

  // Validation
  const validate = () => {
    if (!fullName.trim()) {
      Alert.alert('Validation', 'Full Name is required')
      return false
    }
    if (!gender) {
      Alert.alert('Validation', 'Gender is required')
      return false
    }
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      Alert.alert('Validation', 'Valid Mobile Number is required')
      return false
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Validation', 'Enter a valid email address')
      return false
    }
    if (!specialization) {
      Alert.alert('Validation', 'Specialization is required')
      return false
    }
    if (!hospitalName.trim()) {
      Alert.alert('Validation', 'Hospital/Clinic Name is required')
      return false
    }
    return true
  }

  // Save Handler
  const handleSave = async () => {
    if (!validate()) return
    const formData = {
      profileImage, fullName, gender, dob:formatDateForAPI(dob), mobile, altMobile, email, address, city, state, pincode,
      qualification, specialization, registrationNo, experience, designation, hospitalName, hospitalType, consultationHours, visitingDays,
      clinicAddress, googleLocation, contactPerson, contactNumber, clinicEmail,
      sourceType, referenceName, leadSource, doctorCategory, remarks,
      visitingCard, registrationProof, clinicPhotos
    }
    console.log('Form Data:', formData)


    try {
      if (isEditMode) {
        console.log('Editing Doctor:', formData);
        Alert.alert('Success', 'Doctor details updated successfully!');
        // TODO: call updateDoctor API
      } else {
        console.log('Adding New Doctor:', formData);
        Alert.alert('Success', 'Doctor added successfully!');
        // TODO: call createDoctor API
      }
    } catch (error) {
      console.error('Error saving doctor:', error);
      Alert.alert('Error', 'Failed to save doctor details.');
    }
  }
  // Location permission
    const requestLocationPermission = async () => {
        console.log('Requesting location permission...');
        try {
        // Ask both fine and coarse location
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        ]);

        const fine = granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
        const coarse = granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;

        if (!fine && !coarse) {
            setLoadLocation(false);
            Alert.alert(
            'Location Permission Needed',
            'To access your location, please allow location permissions.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                text: 'Open Settings',
                onPress: () => Linking.openSettings().catch(() => {
                    Alert.alert('Error', 'Unable to open settings');
                }),
                },
            ],
            { cancelable: true }
            );
            return null;
        } else {
            getCurrentPosition();
        }

        } catch (err) {
        console.warn(err);
        showToast('Permission error');
        setLoadLocation(false)
        }
    }

    const getCurrentPosition = () => {
        console.log('Fetching current location...');
        setLoadLocation(true);

        Geolocation.getCurrentPosition(
        (position) => {
            console.log('Location:', position.coords);
            setLocation(position.coords);
            setLoadLocation(false);
        },
        (error) => {
            console.log('GetCurrentPosition Error:', error);
            console.log(`❌ GetCurrentPosition Error [code ${error.code}]:`, error.message);

            if (error.code === 1) {
            showToast('Permission denied.');
            setLoadLocation(false);
            } else if (error.code === 2) {
            Alert.alert(
                'GPS Needed',
                'Your GPS seems to be turned off. Please enable it to get location.',
            )
            setLoadLocation(false);
            } else if (error.code === 3) {
            showToast('Location timeout. Try again.');
            } else {
            setLoading(false);
            showToast('Unknown location error');
            }
            useWatchPositionFallback()
            // setLoading(false);
        },
        {
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 10000,
            forceRequestLocation: true,
            showLocationDialog: true,
        }
        );
    };

    // fallback using watchPosition
    const useWatchPositionFallback = () => {
        const watchId = Geolocation.watchPosition(
        (position) => {
            console.log('✅ Fallback position:', position.coords);
            setLocation(position.coords);
            Geolocation.clearWatch(watchId);
            // navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] })
            setLoadLocation(false);
        },
        (error) => {
            console.log('❌ Fallback error:', error);
            showToast('Unable to fetch location');
            setLoadLocation(false);
        },
        {
            enableHighAccuracy: true,
            distanceFilter: 0,
            interval: 5000,
            fastestInterval: 2000,
        }
        );
    };
    
    
    const showToast = (msg) => {
        ToastAndroid.showWithGravity(msg, ToastAndroid.TOP, ToastAndroid.SHORT)
    }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <MyHeader  title={isEditMode ? "Edit Doctor" : "Add Doctor"}  onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: responsiveWidth(4), paddingBottom: 80 }}>
        {/* Basic Information */}
        <Text style={styles.sectionHeaderText}>Basic Information</Text>
        <View style={styles.section}>
          {/* Profile Image Picker */}
          <TouchableOpacity onPress={handleProfileImage} style={styles.imageProfile}>
            {profileImage ? 
              <Image source={{uri: profileImage}} style={styles.profileImage}/>
            : 
              <View style={[styles.profileImage, {justifyContent: 'center',alignItems: 'center',}]}>
                <MaterialIcons
                  name="person"
                  size={responsiveFontSize(6)}
                  color={`${Colors.black}50`}
                />
              </View>
            }
            <View style={styles.imageOverlay}>
              <MaterialIcons name="camera" color={Colors.white} size={responsiveFontSize(2.5)} />
            </View>
          </TouchableOpacity>
          <CustomInput label="Full Name *" value={fullName} onChangeText={setFullName} icon="person" placeholder="Enter full name" />
          <CustomDropDown uprLabel="Gender *" value={gender} setValue={setGender} data={genderOptions} iconName="male" placeholder="Select gender" />
          <CustomDateTimePicker title="Date of Birth" placeholder="Date of Birth" value={dob} setDate={setDob} iconName="calendar-today" />
          <CustomInput label="Mobile Number *" value={mobile} onChangeText={setMobile} icon="phone" keyboardType="phone-pad" maxLength={10} placeholder="Enter mobile number" />
          <CustomInput label="Alternate Number" value={altMobile} onChangeText={setAltMobile} icon="phone" keyboardType="phone-pad" maxLength={10} placeholder="Enter alternate number" />
          <CustomInput label="Email ID" value={email} onChangeText={setEmail} icon="email" keyboardType="email-address" placeholder="Enter email" />
          <CustomInput label="Address" value={address} onChangeText={setAddress} icon="location-on" placeholder="Enter address" multiline />
          <CustomDropDown uprLabel="State" value={state} setValue={setState} data={stateOptions} iconName="location-city" placeholder="Select state" />
          <CustomDropDown uprLabel="City" value={city} setValue={setCity} data={cityOptions} iconName="location-city" placeholder="Select city" />
          <CustomInput label="Pincode" value={pincode} onChangeText={setPincode} icon="pin" keyboardType="number-pad" maxLength={6} placeholder="Enter pincode" />
        </View>

        {/* Professional Details */}
        <Text style={styles.sectionHeaderText}>Professional Details</Text>
        <View style={styles.section}>
          {/* <CustomInput label="Qualification" value={qualification} onChangeText={setQualification} icon="school" placeholder="Enter qualification" /> */}
          <CustomDropDown uprLabel="Specialization *" value={specialization} setValue={setSpecialization} data={specializationOptions} iconName="medical-services" placeholder="Select specialization" />
          {/* <CustomInput label="Registration No" value={registrationNo} onChangeText={setRegistrationNo} icon="confirmation-number" placeholder="Enter registration no" />
          <CustomInput label="Years of Experience" value={experience} onChangeText={setExperience} icon="history" keyboardType="number-pad" placeholder="Enter years of experience" />
          <CustomInput label="Designation" value={designation} onChangeText={setDesignation} icon="work" placeholder="Enter designation" /> */}
          <CustomInput label="Hospital/Clinic Name *" value={hospitalName} onChangeText={setHospitalName} icon="local-hospital" placeholder="Enter hospital/clinic name" />
          <CustomDropDown uprLabel="Hospital Type" value={hospitalType} setValue={setHospitalType} data={hospitalTypeOptions} iconName="business" placeholder="Select hospital type" />
          {/* <CustomInput label="Consultation Hours" value={consultationHours} onChangeText={setConsultationHours} icon="schedule" placeholder="e.g. 10am - 2pm" />
          <CustomDropDown uprLabel="Visiting Days" value={visitingDays} setValue={setVisitingDays} data={visitingDaysOptions} iconName="calendar-today" placeholder="Select visiting days" multiple /> */}
        </View>

        {/* Clinic / Hospital Details */}
        <Text style={styles.sectionHeaderText}>Clinic / Hospital Details</Text>
        <View style={styles.section}>
          <CustomInput label="Clinic Address" value={clinicAddress} onChangeText={setClinicAddress} icon="location-on" placeholder="Enter clinic address" />
          <View style={styles.fieldCmn}>
              <View style={styles.fieldLeft}>
                  <CustomInput label="Location" icon="location-on" keyboardType={'number-pad'} editable={false}  value={location ? `${location.latitude}, ${location.longitude}` : ''}  onChangeText={(text) => console.log(text)} />
              </View>
              {loadLocation ? (
                  <View style={{ flex: 1, }}>
                      <ActivityIndicator size={responsiveFontSize(2.2)} color={Colors.primary} />
                  </View>
              ) :
                  <TouchableOpacity onPress={() => requestLocationPermission()} style={{ flexDirection: 'row', alignItems: 'center', gap: responsiveWidth(2), marginBottom: responsiveHeight(1.5), }}>
                      <MaterialIcons name="my-location" size={responsiveFontSize(2.2)} color={Colors.primary} />
                      <Text style={{ fontSize: responsiveFontSize(1.6), color: Colors.primary }}>Get Location</Text>
                  </TouchableOpacity>
              }
          </View>
          {/* <CustomInput label="Contact Person" value={contactPerson} onChangeText={setContactPerson} icon="person" placeholder="Enter contact person" /> */}
          <CustomInput label="Contact Number" value={contactNumber} onChangeText={setContactNumber} icon="phone" keyboardType="phone-pad" maxLength={10} placeholder="Enter contact number" />
          {/* <CustomInput label="Clinic Email" value={clinicEmail} onChangeText={setClinicEmail} icon="email" keyboardType="email-address" placeholder="Enter clinic email" /> */}
        </View>

        {/* Reference & Relationship Info */}
        <Text style={styles.sectionHeaderText}>Reference & Relationship Info</Text>
        <View style={styles.section}>
          {/* <CustomDropDown uprLabel="Source Type" value={sourceType} setValue={setSourceType} data={sourceTypeOptions} iconName="source" placeholder="Select source type" />
          <CustomInput label="Reference Name" value={referenceName} onChangeText={setReferenceName} icon="person" placeholder="Enter reference name" />
          <CustomDropDown uprLabel="Lead Source" value={leadSource} setValue={setLeadSource} data={leadSourceOptions} iconName="campaign" placeholder="Select lead source" /> */}
          <CustomDropDown uprLabel="Doctor Category" value={doctorCategory} setValue={setDoctorCategory} data={doctorCategoryOptions} iconName="category" placeholder="Select doctor category" />
          <CustomInput label="Remarks / Notes" value={remarks} onChangeText={setRemarks} icon="notes" placeholder="Enter remarks" multiline />
        </View>

        {/* Documents */}
        {/* <Text style={styles.sectionHeaderText}>Documents</Text>
        <View style={[styles.section, {gap: responsiveHeight(2),}]}>
          <View style={{}}>
            <TouchableOpacity style={styles.uploadBox1} onPress={handleVisitingCard}>
              {visitingCard ? (
                  <View style={[{position: 'relative',}]}>
                      <Image source={{ uri: visitingCard ? visitingCard : 'http'}} style={styles.image} resizeMode='cover' />
                      <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => setVisitingCard(null)}
                      >
                      <MaterialIcons name="close" size={responsiveFontSize(2)} color={Colors.deleteButton} />
                      <Text style={styles.removeImageText}>Remove</Text>
                      </TouchableOpacity>
                  </View>
              ) : (
                  <View style={styles.uploadPlaceholder}>
                    <MaterialIcons name="file-upload" size={responsiveFontSize(2.5)} color={Colors.primary} />
                    <Text style={styles.uploadText}>Tap to Upload Visiting Card</Text>
                  </View>
              )}
            </TouchableOpacity>
          </View>
          <View style={{}}>
            <TouchableOpacity style={styles.uploadBox1} onPress={handleRegistrationProof}>
              {registrationProof ? (
                  <View style={[{position: 'relative',}]}>
                      <Image source={{ uri: registrationProof ? registrationProof : 'http'}} style={styles.image} resizeMode='cover' />
                      <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => setRegistrationProof(null)}
                      >
                      <MaterialIcons name="close" size={responsiveFontSize(2)} color={Colors.deleteButton} />
                      <Text style={styles.removeImageText}>Remove</Text>
                      </TouchableOpacity>
                  </View>
              ) : (
                  <View style={styles.uploadPlaceholder}>
                    <MaterialIcons name="file-upload" size={responsiveFontSize(2.5)} color={Colors.primary} />
                    <Text style={styles.uploadText}>Tap to Upload Registration</Text>
                  </View>
              )}
            </TouchableOpacity>
          </View>
        </View> */}

        <View style={styles.uploadContainer}>
          <Text style={styles.sectionTitle}>Clinic Photos</Text>
          <View style={[styles.section,{padding: responsiveWidth(1),}]}>
          <View style={styles.imageGrid}>
            {clinicPhotos.map((photo, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image
                  source={{ uri: photo }}
                  style={styles.uploadedImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() =>
                    setClinicPhotos(clinicPhotos.filter((_, i) => i !== index))
                  }
                >
                  <MaterialIcons
                    name="close"
                    size={responsiveFontSize(2)}
                    color={Colors.white}
                  />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add more photos button */}
            <TouchableOpacity
              style={[styles.addPhotoBox, clinicPhotos.length >= 4 && { opacity: 0.5 },]}
              onPress={handleClinicPhotos}
              disabled={clinicPhotos.length >= 4}
            >
              <MaterialIcons
                name="file-upload"
                size={responsiveFontSize(3)}
                color={Colors.primary}
              />
              <Text style={styles.addPhotoText}>
                {clinicPhotos.length > 0 ? clinicPhotos.length >= 4 ? 'Maximum Reached' : 'Add More' : 'Upload Clinic Photos'}
              </Text>
            </TouchableOpacity>
          </View>
          </View>
        </View>


        {/* Buttons */}
        <View style={{ marginTop: responsiveHeight(3), }}>
          <CustomButton
            title={isEditMode ? "Update" : "Save"}
            onPress={handleSave}
            bgColor={Colors.primary}
            color={Colors.white}
            borderC={Colors.primary}
          />
          {/* <CustomButton
            title="Cancel"
            onPress={() => navigation.goBack()}
            bgColor={Colors.white}
            color={Colors.primary}
            borderC={Colors.primary}
          /> */}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionHeaderText: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(1),
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: responsiveWidth(2),
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(1),
    elevation: 1,
    
  },
  fieldCmn:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: responsiveWidth(2),
  },
  fieldLeft:{
      flex:2,
  },
  fieldRight:{
      flex:2,
  },
  imageProfile: {
    alignSelf: 'center',
    marginBottom: responsiveHeight(2),
    // position: 'relative',
    width: responsiveWidth(30),
    height: responsiveWidth(30),
    borderRadius: responsiveWidth(15),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: `${Colors.black}50`,
  },
  profileImage: {
    width: responsiveWidth(30),
    height: responsiveWidth(30),
    borderRadius: responsiveWidth(15),
    borderWidth: 1,
    borderColor: Colors.black,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  imagePicker: {
    width: responsiveWidth(28),
    height: responsiveWidth(28),
    borderRadius: responsiveWidth(14),
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: `${Colors.black}50`,
    padding: responsiveHeight(1.2),
    justifyContent: 'center',
    alignItems: 'center',
    // overflow: 'hidden',
    marginBottom: responsiveHeight(1.5),
    alignSelf: 'center',
  },
  imagePickerText: {
    color: Colors.secondary,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.7),
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: Colors.primaryWithOpacity,
    borderStyle: 'dashed',
    borderRadius: responsiveWidth(2),
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: responsiveHeight(2),
    minHeight: responsiveHeight(14),
  },
  uploadBox1: {
    borderWidth: 1,
    borderColor: Colors.primaryWithExtraOpacity,
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
    minHeight: responsiveHeight(10),
    borderStyle: 'dashed',
  },

  uploadBoxActive: {
    backgroundColor: '#EAF6FF',
  },

  previewImage: {
    width: '100%',
    height: responsiveHeight(16),
    borderRadius: responsiveWidth(2),
    resizeMode: 'stretch'
  },

  uploadText: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.primary,
    marginTop: responsiveHeight(1),
  },

  fileText: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
    color: Colors.black,
  },
  image: {
    width: '100%',
    height: responsiveHeight(15),
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryWithExtraOpacity,
    paddingVertical: responsiveHeight(3),
  },
  uploadText1: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.tertiary,
  },

  removeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: responsiveHeight(0.8),
    paddingHorizontal: responsiveWidth(3),
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


  uploadContainer: {
  marginVertical: responsiveHeight(2),
},

sectionTitle: {
  fontSize: responsiveFontSize(2),
  fontWeight: '600',
  color: Colors.primary,
  marginBottom: responsiveHeight(1),
},

imageGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: responsiveWidth(2),
},

imageWrapper: {
  position: 'relative',
  width: responsiveWidth(28),
  height: responsiveHeight(12),
  borderRadius: responsiveWidth(2),
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: Colors.primaryWithExtraOpacity,
},

uploadedImage: {
  width: '100%',
  height: '100%',
  borderRadius: responsiveWidth(2),
},

removeBtn: {
  position: 'absolute',
  top: 4,
  right: 4,
  backgroundColor: Colors.deleteButton,
  borderRadius: 100,
  padding: 3,
},

addPhotoBox: {
  width: responsiveWidth(28),
  height: responsiveHeight(12),
  borderWidth: 1,
  borderStyle: 'dashed',
  borderColor: Colors.primaryWithExtraOpacity,
  borderRadius: responsiveWidth(2),
  justifyContent: 'center',
  alignItems: 'center',
},

addPhotoText: {
  fontSize: responsiveFontSize(1.6),
  color: Colors.primary,
  marginTop: responsiveHeight(0.5),
  textAlign: 'center'
},

})

export default AddDoctor