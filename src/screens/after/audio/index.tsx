import React from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, Platform } from 'react-native'
import { styles } from "./styles"
import { exclaim, playTime } from '../../../constants/images';
import { navigate } from '../../../services/navigationService';
import { Path } from '../../../constants/path';

const Music = () => {
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 44;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: statusBarHeight }}>
      <View style={styles.videTextView}>
        <View style={styles.videoTextBox}>
          <Image source={playTime} style={styles.playImage} />
          <Text style={styles.videoText}>Play Time</Text>
        </View>
        <TouchableOpacity onPress={() => navigate(Path.INSTRUCTIONS, {})}>
          <Image source={exclaim} style={styles.playImage} />
        </TouchableOpacity>
      </View>
      <View style={styles.line} />
    </View>
  )
}

export default Music