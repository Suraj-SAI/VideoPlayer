import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  StatusBar,
  BackHandler,
  View,
  Dimensions,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {
  GestureHandlerRootView,
  LongPressGestureHandler,
  State,
} from 'react-native-gesture-handler';
import ImmersiveMode from 'react-native-immersive-mode';
import Video from 'react-native-video-controls';

const { width } = Dimensions.get('window');

const SEEK_JUMP = 10; // Jump seconds per press
const SEEK_INTERVAL = 200; // Milliseconds between seeks during long press

const FullScreenVideoScreen = ({ route }: any) => {
  const { videoUri } = route.params;
  const navigation = useNavigation<any>();
  const videoRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentTimeRef = useRef(0);

  const exitFullScreen = () => {
    navigation.goBack();
    Orientation.lockToPortrait();
  };

  useEffect(() => {
    StatusBar.setHidden(true);
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      exitFullScreen();
      return true;
    });
 
    ImmersiveMode.fullLayout(true);
    ImmersiveMode.setBarMode('Full');
    Orientation.unlockAllOrientations();

    return () => {
      backHandler.remove();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleProgress = (progress: { currentTime: number }) => {
    currentTimeRef.current = progress.currentTime;
  };

  const handleSeek = (direction: 'forward' | 'backward') => {
    const playerInstance = videoRef.current?.player?.ref;
    if (!playerInstance) return;

    const newTime = direction === 'forward'
      ? currentTimeRef.current + SEEK_JUMP
      : Math.max(0, currentTimeRef.current - SEEK_JUMP);

    playerInstance.seek(newTime);
    currentTimeRef.current = newTime;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <LongPressGestureHandler
        minDurationMs={400}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            const direction = nativeEvent.x < width / 2 ? 'backward' : 'forward';
            handleSeek(direction); 
            intervalRef.current = setInterval(() => {
              handleSeek(direction);
            }, SEEK_INTERVAL);
          } else if (
            nativeEvent.state === State.END ||
            nativeEvent.state === State.CANCELLED
          ) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        }}
      >
        <View style={styles.fullScreenWrapper}>
          <Video
            ref={videoRef}
            disableVolume={false}
            disableBack={false}
            resizeMode="contain"
            disableFullscreen={false}
            source={{ uri: videoUri }}
            onProgress={handleProgress}
            onBack={exitFullScreen}
            style={styles.videoPlayer}
            repeat={true}
            rate={1.0}
            disableZoom={true}
          />
        </View>
      </LongPressGestureHandler>
    </GestureHandlerRootView>
  );
};

// Keep the same styles as before
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  fullScreenWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
});

export default FullScreenVideoScreen;