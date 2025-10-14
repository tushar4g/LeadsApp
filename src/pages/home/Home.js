import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateDistance } from '../../redux/slices/userSlice';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

const Home = () => {
  const dispatch = useDispatch();
  const { name, distance, tasks, userID } = useSelector((state) => state.user);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome, {name} 👋</Text>
        <Text style={[styles.headerText, {fontSize: responsiveFontSize(1.6)}]}>ID: {userID}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Distance Covered</Text>
        <Text style={styles.value}>{distance.toFixed(2)} km</Text>
        <TouchableOpacity
          onPress={() => dispatch(updateDistance(distance + 10))}
          style={styles.button}
        >
          <Text style={styles.buttonText}>+ Add 10 km</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>My Tasks</Text>
        <Text style={styles.taskText}>Total: {tasks.total}</Text>
        <Text style={styles.taskText}>Pending: {tasks.pending}</Text>
        <Text style={styles.taskText}>Completed: {tasks.completed}</Text>
      </View>
    </ScrollView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  header: { padding: responsiveWidth(4) },
  headerText: { fontSize: responsiveFontSize(2), fontWeight: '600', color: 'black'},
  card: {
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(3),
    margin: responsiveWidth(3),
    padding: responsiveWidth(4),
    elevation: 3,
  },
  title: { fontSize: responsiveFontSize(2.2), fontWeight: '700', marginBottom: 5 },
  value: { fontSize: responsiveFontSize(2), color: '#333', marginBottom: 10 },
  button: {
    backgroundColor: '#6366F1',
    padding: responsiveHeight(1.2),
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  taskText: { fontSize: responsiveFontSize(1.8), color: '#555' },
});