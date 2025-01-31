import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import Orientation from 'react-native-orientation-locker';

const FullScreenVideoScreen = ({ route }: any) => {
  const { videoUri } = route.params;
  const navigation = useNavigation<any>();

  const exitFullScreen = () => {
    navigation.goBack();
    Orientation.lockToPortrait();
  };

  useEffect(() => {
    Orientation.unlockAllOrientations();
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
