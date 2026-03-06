import React, { useEffect } from 'react';
import { View, Text, Image, Dimensions, ImageSourcePropType, TouchableOpacity, SafeAreaView, StatusBar} from "react-native";
import Animated, { 
  useSharedValue,
  useAnimatedScrollHandler, 
  useAnimatedStyle, 
  interpolate,
  SharedValue   
} from "react-native-reanimated";

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import AppBar from '../appbar';
import {safeArea} from '../service/seftArea';

const { width, height } = safeArea;
const _itemSize = width * 0.3;
const _spacing = 20;
const _itemTotalSize = _itemSize + _spacing;
let lastKnownIndex = 0;

const colors = [
  '#FF6F79',
  '#FDDA48',
  '#62D063',
  '#6DBCFF',
  '#8398F5'
];

const datas = [
  {
    name: 'Code',
    image: require('../assets/menu/code.png'),
    backgroundColor: '#FF6F79',
    screen: 'CodeScreen'
  },
  {
    name: 'Play',
    image: require('../assets/menu/joystick.png'),
    backgroundColor: '#FDDA48',
    screen: 'PlayScreen'
  },
  {
    name: 'Build',
    image: require('../assets/menu/lego.png'),
    backgroundColor: '#62D063',
    screen: 'BuildScreen'
  },
  {
    name: 'IoT',
    image: require('../assets/menu/domotics.png'),
    backgroundColor: '#6DBCFF',
    screen: 'IotScreen'
  }
];

type CarouselItemProps = {
  imageSource: ImageSourcePropType;
  name: string;
  index: number;
  scrollX: SharedValue<number>;
  backgroundColor: string;
  screen: string;
};

function CarouselItem ({
    imageSource, 
    name,
    index,
    scrollX,
    backgroundColor,
    screen
  }: CarouselItemProps) {

  const navigation = useNavigation<StackNavigationProp<any>>();

  const stylez = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      [index - 1, index, index + 1],
      [0.7, 1, 0.7],
      'clamp'
    );

    return {
      transform: [{ scale }]
    };
  });

  const handlePress = () => {
    navigation.navigate(screen);
  };

  return(
    <Animated.View style = {stylez}>
      <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
        <View style = {{alignItems: 'center', marginTop: 30}}>
          <View
              style={{
              width: _itemSize,
              height: _itemSize,
              borderRadius: _itemSize / 2,
              backgroundColor, 
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 8,
            }}
            >
            <Image
              source = {imageSource}
              style = {{
                width: _itemSize * 0.6,
                height: _itemSize * 0.6,
              }}
            />
          </View>
          <Text style={{ fontSize: 25, fontWeight: 'bold', marginTop: 5}}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

export function HomeScreen() {
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
      scrollX.value = e.contentOffset.x / _itemTotalSize;
  });

  // useEffect(() => {
  //   return () => {
  //     lastKnownIndex = Math.round(scrollX.value);
  //   };
  // }, [scrollX]);

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar hidden/>    
      <AppBar />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Animated.FlatList 
          style={{ flexGrow: 0, marginTop: -50}}
          contentContainerStyle={{
            gap: _spacing,
            paddingHorizontal: (width - _itemSize)/2 
          }}
          data = {datas}
          keyExtractor={(_, index) => String(index)}
          renderItem={({item, index}) => {
            return < CarouselItem
              imageSource = {item.image}
              name = {item.name}
              index = {index}
              scrollX = {scrollX}
              backgroundColor={item.backgroundColor}
              screen = {item.screen}
            />
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          snapToInterval={_itemTotalSize}
          decelerationRate="fast"

          initialScrollIndex={lastKnownIndex}
          getItemLayout={(_, index) => ({
            length: _itemTotalSize,
            offset: _itemTotalSize * index,
            index,
          })}
        />
      </View>
    </View> 
  );
}


