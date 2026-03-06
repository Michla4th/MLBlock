import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, FlatList, Image} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

import {safeArea} from '../../service/seftArea';

const { width, height } = safeArea;

const MENU_DATA = [
  { id: "1", title: "Drive", image: require("../../assets/play/MiLa-bit/icon.png") },
  { id: "2", title: "Draw", image: require("../../assets/play/MiLa-bit/icon.png") },
  { id: "3", title: "Music", image: require("../../assets/play/MiLa-bit/icon.png") },
  { id: "4", title: "Voice", image: require("../../assets/play/MiLa-bit/icon.png") },
];

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

const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

export default function PlayScreen({ navigation }: { navigation: StackNavigationProp<any> }) {
    return (
    <View style={{ flex: 1}}>
        <StatusBar hidden={true} translucent={true} />
        <AppBar_code navigation={navigation} />
        <View style={styles.container}>
            <FlatList
                data={MENU_DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    alignItems: "center",  
                    flexGrow: 1,         
                }}
            />
        </View>
    </View>
    );
}

const CARD_WIDTH = width * 0.3;
const CARD_HEIGHT = height * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'red',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: "60%",
    height: "60%",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
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