import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setUserName } from '../../redux/slices/userSlice';

const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const { name, tasks, avatar, email, phone} = useSelector((state) => state.user);

  const handleEditName = () => {
    // Example action to change the name temporarily
    navigation.navigate('EditProfile');
    // dispatch(setUserName('kamlesh'))
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerBackground} />
      <Image
        source={{ uri: avatar }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>

      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoNumber}>{tasks.total}</Text>
          <Text style={styles.infoLabel}>Leads</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoNumber}>{tasks.completed}</Text>
          <Text style={styles.infoLabel}>Clients</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleEditName}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Language Setting</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>FAQ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItemLast}>
          <Text style={styles.menuText}>Terms of Services</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;

// --- Styles (same as your version) ---
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 0,
    backgroundColor: '#f7f7f7',
    paddingBottom: 40,
    minHeight: '100%',
    position: 'relative',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 180,
    backgroundColor: '#4e8cff',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: -1,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginTop: 60,
    marginBottom: 18,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222',
    letterSpacing: 0.5,
  },
  email: {
    fontSize: 16,
    color: '#4e8cff',
    marginBottom: 24,
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 32,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  infoBox: {
    alignItems: 'center',
    marginHorizontal: 24,
  },
  infoNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4e8cff',
    marginBottom: 2,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4e8cff',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 28,
    marginBottom: 32,
    shadowColor: '#4e8cff',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  section: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    marginTop: 10,
  },
  menuItem: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingHorizontal: 12,
  },
  menuItemLast: {
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  menuText: {
    fontSize: 17,
    color: '#4e8cff',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
