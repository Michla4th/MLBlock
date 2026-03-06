import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

function AppBar_code({ navigation }: { navigation: StackNavigationProp<any> }) {
  return (
    <View style={styles.appBar}>
      <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')} style={styles.appBarButton}>
        <Icon name="arrow-undo" size={24} color="#6DBCFF" />
        <Text style={styles.appBarText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function BuildScreen({ navigation }: { navigation: StackNavigationProp<any> }) {
    return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden={true} translucent={true} />
      <AppBar_code navigation={navigation} />
    </View>
    );
}

const styles = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  appBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appBarText: {
    color: '#6DBCFF',
    fontSize: 20,
    marginLeft: 5,
    fontWeight: 'bold',
  },
});