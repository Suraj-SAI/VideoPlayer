import React, { useRef } from "react";
import { View, PanResponder, Animated, StyleSheet } from "react-native";
import TrackPlayer from "react-native-track-player";

const CustomProgressBar = ({ progress } : any) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  // Update animation when progress changes
  Animated.timing(animatedWidth, {
    toValue: (progress.position / progress.duration) * 100,
    duration: 200,
    useNativeDriver: false,
  }).start();

  // PanResponder for touch interaction (dragging)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const newPosition = Math.max(0, Math.min(gesture.moveX, 300)); // Limit within bar width
        const seekValue = (newPosition / 300) * progress.duration;
        TrackPlayer.seekTo(seekValue);
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.progressBar} {...panResponder.panHandlers}>
        {/* Progress Fill */}
        <Animated.View style={[styles.progressFill, { width: animatedWidth.interpolate({
          inputRange: [0, 100],
          outputRange: ["0%", "100%"]
        }) }]} />
        
        {/* Thumb Indicator */}
        <Animated.View style={[styles.thumb, {
          left: animatedWidth.interpolate({
            inputRange: [0, 100],
            outputRange: ["0%", "98%"], // Keeps thumb within bounds
          })
        }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  progressBar: {
    width: 300, // Set fixed width
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 4,
    position: "relative",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  thumb: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    position: "absolute",
    top: -4,
  },
});

export default CustomProgressBar;
