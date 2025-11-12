import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native'
import {
  responsiveFontSize,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import RenderHTML from 'react-native-render-html'
import Colors from '../../../style/Colors'

const termsAndConditionsHtml = `
  <h1>Terms and Conditions</h1>
  <p><strong>Last updated: November 12, 2025</strong></p>
  <p>Please read these terms and conditions carefully before using Our Service.</p>
  
  <h2>1. Acknowledgment</h2>
  <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
  <p>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>
  
  <h2>2. User Accounts</h2>
  <p>When You create an account with Us, You must provide Us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of Your account on Our Service.</p>
  <p>You are responsible for safeguarding the password that You use to access the Service and for any activities or actions under Your password, whether Your password is with Our Service or a Third-Party Social Media Service.</p>
  
  <h2>3. Intellectual Property</h2>
  <p>The Service and its original content (excluding Content provided by You or other users), features and functionality are and will remain the exclusive property of the Company and its licensors.</p>

  <h2>4. Termination</h2>
  <p>We may terminate or suspend Your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.</p>
  
  <h2>5. Contact Us</h2>
  <p>If you have any questions about these Terms and Conditions, You can contact us by email at: <strong>support@leadsapp.com</strong></p>
`

const TermsAndConditions = ({ navigation }) => {
  const { width } = useWindowDimensions()

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.back}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={responsiveFontSize(2.2)}
            color={Colors.white}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Terms & Conditions</Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <RenderHTML
          contentWidth={width - responsiveWidth(8)}
          source={{ html: termsAndConditionsHtml }}
          tagsStyles={tagsStyles}
        />
      </ScrollView>
    </View>
  )
}

export default TermsAndConditions

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    height: responsiveHeight(7),
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(3),
  },
  back: { width: responsiveWidth(10), justifyContent: 'center' },
  title: {
    flex: 1,
    textAlign: 'center',
    color: Colors.white,
    fontSize: responsiveFontSize(2),
    fontWeight: '700',
  },
  container: {
    padding: responsiveWidth(4),
    backgroundColor: Colors.white,
  },
})

const tagsStyles = {
  h1: {
    fontSize: responsiveFontSize(2.5),
    color: Colors.textPrimary,
    marginBottom: responsiveHeight(1),
    borderBottomWidth: 1,
    borderColor: Colors.primaryWithExtraOpacity,
    paddingBottom: responsiveHeight(1),
  },
  h2: {
    fontSize: responsiveFontSize(2),
    color: Colors.textPrimary,
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(1),
  },
  p: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.textSecondary,
    lineHeight: responsiveHeight(2.5),
    marginBottom: responsiveHeight(1),
  },
  ul: {
    marginLeft: responsiveWidth(4),
  },
  li: {
    fontSize: responsiveFontSize(1.6),
    color: Colors.textSecondary,
    lineHeight: responsiveHeight(2.5),
    marginBottom: responsiveHeight(0.5),
  },
  strong: {
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
}