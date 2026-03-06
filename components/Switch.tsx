// components/AnimatedSwitch.tsx

import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type AnimatedSwitchProps = {
  value: boolean;
  onValueChange: (val: boolean) => void;
};

const AnimatedSwitch: React.FC<AnimatedSwitchProps> = ({ value, onValueChange }) => {
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const thumbPosition = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 37],
  });

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#282C34', '#282C34'],
  });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onValueChange(!value)}>
      <Animated.View style={[styles.switchContainer, { backgroundColor }]}>
        <Animated.View style={[styles.thumb, { left: thumbPosition }]}>
          <Icon 
            name={value ? "logo-python" : "extension-puzzle"}
            size={24}
            color={value ? '#7284FB' : '#7284FB'}
          />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 70,
    height: 35,
    borderRadius: 30,
    padding: 3,
    justifyContent: 'center',
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 15,
    position: 'absolute',
    top: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    // elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default AnimatedSwitch;
