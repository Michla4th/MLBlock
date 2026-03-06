// AppBar.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import { MaterialIcons, FontAwesome5, Entypo } from '@expo/vector-icons';

export default function AppBar() {
  return (
    <View style={styles.container}>
      {/* Robot icon */}
      <View style={styles.item}>
        <FontAwesome5 name="robot" size={24} color="#6DBCFF" />
        <Text style={{ fontSize: 24, marginLeft: 10, fontWeight: 'bold' }}>MiLa:bit</Text>
      </View>
      {/* Setting icon */}
      <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center'}}>
        <MaterialIcons name="settings" size={24} color="gray" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 0,
    height: 50,
  },
  item: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#F2F1F7', 
    paddingLeft: 15,
    padding: 2, 
    paddingRight: 15, 
    borderRadius: 30, 
  },
});