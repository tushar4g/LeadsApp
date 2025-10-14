import React from 'react'
import StackNavigation from './src/navigation/StackNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './src/redux/store';

const App = () => {
  return (
    <SafeAreaView style={{flex:1}}>
      <Provider store={store}>
        <StackNavigation />
      </Provider>
    </SafeAreaView>
  )
}

export default App