import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  StatusBar,
  BackHandler,
  SafeAreaView,
  View,
  Dimensions,
} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import Orientation from 'react-native-orientation-locker';
import {
  GestureHandlerRootView,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

const FullScreenVideoScreen = ({ route }: any) => {
  const { videoUri } = route.params;

  const navigation = useNavigation<any>();
  const videoRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const exitFullScreen = () => {
    navigation.goBack();
    StatusBar.setHidden(false);
    Orientation.lockToPortrait();
  };

  useEffect(() => {
    StatusBar.setHidden(true);

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      exitFullScreen();
      return true;
    });

    Orientation.unlockAllOrientations();

    return () => {
      backHandler.remove();
      StatusBar.setHidden(false);
    };
  }, []);

  const handleProgress = (progress: { currentTime: number }) => {
    setCurrentTime(progress.currentTime);
  };

  const handleDoubleTap = (event: any) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const touchX = event.nativeEvent.x;
      const playerInstance = videoRef.current?.player?.ref;

      if (!playerInstance) return;

      if (touchX < width / 2) {
        playerInstance.seek(Math.max(0, currentTime - 10));
      } else {
        playerInstance.seek(currentTime + 10);
      }
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container} pointerEvents="box-none">
        <TapGestureHandler
          numberOfTaps={2}
          onHandlerStateChange={handleDoubleTap}
        >
          <View style={styles.fullScreenWrapper}>
            <VideoPlayer
              ref={videoRef}
              disableVolume={false}
              disableBack={false}
              resizeMode="contain"
              disableFullscreen={true}
              source={{ uri: videoUri }}
              onShowControls={true}
              repeat={true}
              rate={1.0}
              style={styles.videoPlayer}
              onProgress={handleProgress}
              onBack={exitFullScreen}
              tapAnywhereToPause={true}
              subtitles={{uri: videoUri}}
            />
          </View>
        </TapGestureHandler>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

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
  zoomableView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
});

export default FullScreenVideoScreen;
