import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  StatusBar,
  BackHandler,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {
  GestureHandlerRootView,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';
import ImmersiveMode from 'react-native-immersive-mode';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

const SEEK_DELTA = 10;

const FullScreenVideoScreen = ({ route }: any) => {
  const { videoUri } = route.params;
  const navigation = useNavigation<any>();
  const videoRef = useRef<any>(null);
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [resizeMode, setResizeMode] = useState<'contain' | 'cover'>('contain');
  const scale = useRef(new Animated.Value(1)).current;
  const baseScale = useRef<any>(new Animated.Value(1)).current;
  const [progressBarWidth, setProgressBarWidth] = useState(0);


  useEffect(() => {
    StatusBar.setHidden(true);
    ImmersiveMode.fullLayout(true);
    ImmersiveMode.setBarMode('Full');
    Orientation.unlockAllOrientations();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      Orientation.lockToPortrait();
      return true;
    });

    setTimeout(() => {
      setShowControls(prev => !prev);
    }, 3000);

    return () => {
      backHandler.remove();
      scale.setValue(1);
      baseScale.setValue(1);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (time: number) => {
    const newTime = Math.max(0, Math.min(time, duration));
    videoRef?.current?.seek(newTime);
    setCurrentTime(newTime);
  };


  return (
    <GestureHandlerRootView style={styles.container}>
      <TapGestureHandler
        numberOfTaps={1}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.END) {
            setTimeout(() => {
              setShowControls(prev => !prev);
            }, 200);
          }
        }}>
        <TapGestureHandler
          numberOfTaps={2}
          maxDelayMs={200}
          onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.state === State.ACTIVE) {
              const tapX = nativeEvent.x;
              const screenThird = width / 3;

              if (tapX < screenThird) {
                handleSeek(currentTime - SEEK_DELTA);
              } else if (tapX > screenThird * 2) {
                handleSeek(currentTime + SEEK_DELTA);
              }
            }
          }}
        >
          <View style={styles.videoContainer}>
            <Video
              ref={videoRef}
              source={{ uri: videoUri }}
              style={styles.video}
              paused={paused}
              resizeMode={resizeMode}
              onProgress={({ currentTime }) => setCurrentTime(currentTime)}
              onLoad={(data) => {
                setDuration(data.duration)
              }}
              repeat={true}
              ignoreSilentSwitch="ignore"
            />

            {showControls && (
              <View style={styles.controlsOverlay}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    navigation.goBack();
                    Orientation.lockToPortrait();
                  }}
                >
                  <Text style={styles.controlText}>Back</Text>
                </TouchableOpacity>

                <View style={styles.centerControls}>
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => setPaused(!paused)}
                  >
                    <Text style={styles.controlTextLarge}>
                      {paused ? 'Play' : 'Pause'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableWithoutFeedback
                  onPress={(event) => {
                    if (progressBarWidth === 0 || duration === 0) return;
                    const locationX = event.nativeEvent.locationX;
                    const newTime = Math.floor((locationX / progressBarWidth) * duration);
                    handleSeek(newTime);
                  }}
                >
                  <View style={styles.bottomControls}>
                    <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                    <View
                      style={styles.progressBar}
                      onLayout={(event) => {
                        const { width } = event.nativeEvent.layout;
                        setProgressBarWidth(width);
                      }}
                    >
                      <View style={[styles.progressFill, { width: `${(currentTime / duration) * 100}%` }]} />
                    </View>
                    <Text style={styles.timeText}>{formatTime(duration)}</Text>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableOpacity
                  style={styles.zoomButton}
                  onPress={() => setResizeMode(prev => prev === 'contain' ? 'cover' : 'contain')}
                >
                  <Text style={styles.controlText}>
                    {resizeMode === 'contain' ? 'Zoom In' : 'Zoom Out'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TapGestureHandler>
      </TapGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoContainer: {
    flex: 1,
  },
  videoWrapper: {
    flex: 1,
    backgroundColor: 'black',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
  },
  centerControls: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'red',
  },
  controlText: {
    color: 'white',
    fontSize: 16,
  },
  controlTextLarge: {
    color: 'white',
    fontSize: 24,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
  },
  zoomButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
  },
  progressBarContainer: {
    height: 20, // Larger touch area
    justifyContent: 'center',
    marginHorizontal: 10,

  },
});

export default FullScreenVideoScreen;