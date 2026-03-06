import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Screens
import { HomeScreen } from "./navigation/HomeScreen";
import CodeScreen from './navigation/screens/CodeSreen';
import PlayScreen from './navigation/screens/PlayScreen';
import BuildScreen from './navigation/screens/BuildScreen';
import IotScreen from './navigation/screens/IotScreen';
import Blockly from './navigation/blockly/Blockly';
import BlocklyJunior from "./navigation/blockly/BlocklyJunior";

enableScreens(true);
const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <LottieView
          source={require('./assets/lottie/Loading.json')}
          autoPlay
          loop
          style={{ width: 400, height: 400 }}
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false, animation: 'fade'}}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="CodeScreen" component={CodeScreen} />
            <Stack.Screen name="PlayScreen" component={PlayScreen} />
            <Stack.Screen name="BuildScreen" component={BuildScreen} />
            <Stack.Screen name="IotScreen" component={IotScreen} />
            <Stack.Screen name="Blockly" component={Blockly} />
            <Stack.Screen name="BlocklyJunior" component={BlocklyJunior} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffffff',
  },
});
