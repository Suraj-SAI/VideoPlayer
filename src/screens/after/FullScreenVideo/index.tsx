import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, BackHandler } from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import Orientation from 'react-native-orientation-locker';

const FullScreenVideoScreen = ({ route }: any) => {
  const { videoUri } = route.params;
  const navigation = useNavigation<any>();

  const exitFullScreen = () => {
    StatusBar.setHidden(false);
    navigation.goBack();
    Orientation.lockToPortrait();
  };

  useEffect(() => {
    StatusBar.setHidden(true);

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      exitFullScreen(); // Call custom exit function
      return true; // Prevent default back behavior
    });


    Orientation.unlockAllOrientations();

    return () => {
      backHandler.remove(); // Clean up listener when unmounting
      StatusBar.setHidden(false); // Restore status bar visibility
    };
  } , [])

  return (
    <View style={styles.container}>
      <VideoPlayer
        disableVolume={false}
        disableBack={true}
        resizeMode="contain"
        disableFullscreen={false}
        source={{
          uri: videoUri,
        }}
        onShowControls={true}
        repeat={true}
        rate={1.0}
        onEnterFullscreen={exitFullScreen}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default FullScreenVideoScreen;
