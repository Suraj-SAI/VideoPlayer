import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, BackHandler } from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import Orientation from 'react-native-orientation-locker';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

const FullScreenVideoScreen = ({ route }: any) => {
  const { videoUri } = route.params;
  const navigation = useNavigation<any>();

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
  }, [])

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
