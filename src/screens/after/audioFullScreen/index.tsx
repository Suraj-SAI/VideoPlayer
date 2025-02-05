import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import TrackPlayer, { useProgress, State } from 'react-native-track-player';
import { styles } from './styles';
import { back, music, pausesign, playsign } from '../../../constants/images';
import * as Progress from 'react-native-progress';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const AudioFullScreen = ({ route, navigation }: any) => {
  const { musicUri, musics, index } = route.params;
  const [trackIndex, setTrackIndex] = useState(index);
  const [isPlaying, setIsPlaying] = useState(true);
  const progress = useProgress();

  useEffect(() => {
    console.log(musics);

    const setupPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer();
      } catch (error: any) {
        if (error.message !== 'The player has already been initialized via setupPlayer.') {
          throw error;
        }
      }
      try {
        await TrackPlayer.reset();
        await TrackPlayer.add({
          id: musics[index].path,
          url: musicUri,
          title: musics[index].name,
        });
        await TrackPlayer.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error setting up TrackPlayer:", error);
      }
    };

    setupPlayer();

    return () => {
      cleanup();
    };
  }, [musicUri]);


  const cleanup = async () => {
    try {
      await TrackPlayer.stop();
      await TrackPlayer.reset();
      setIsPlaying(false);
    } catch (error) {
      console.error("Error in cleanup:", error);
    }
  };

  const togglePlayback = async () => {
    try {
      const state = await TrackPlayer.getState();
      if (state === State.Playing) {
        await TrackPlayer.pause();
        setIsPlaying(false);
      } else {
        await TrackPlayer.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playNextTrack = async () => {
    if (trackIndex < musics.length - 1) {
      const newIndex = trackIndex + 1;

      await TrackPlayer.stop();
      await TrackPlayer.reset();

      await TrackPlayer.add({
        id: `track-${newIndex}`,
        url: musics[newIndex].path,
        title: musics[newIndex].name,
      });

      await TrackPlayer.play();
      setTrackIndex(newIndex);
      setIsPlaying(true);
    }
  };


  const playPreviousTrack = async () => {
    if (trackIndex > 0) {
      const newIndex = trackIndex - 1;

      await TrackPlayer.stop();
      await TrackPlayer.reset();

      await TrackPlayer.add({
        id: `track-${newIndex}`,
        url: musics[newIndex].path,
        title: musics[newIndex].name,
      });

      await TrackPlayer.play();
      setTrackIndex(newIndex);
      setIsPlaying(true);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            cleanup();
            navigation.goBack();
          }}
        >
          <Image source={back} style={styles.iconText} />
        </TouchableOpacity>
        <Text style={styles.title}>Play Time</Text>
        <View></View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <View style={styles.artworkContainer}>
          <Image source={music} style={styles.artworkText} />
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(progress.position)}</Text>
        <Progress.Bar
          progress={progress.duration > 0 ? progress.position / progress.duration : 0}
          width={wp(90)}
          color="red"
          unfilledColor="#555"
          borderWidth={0}
          style={styles.progressBar}
        />
        <Text style={styles.timeText}>{formatTime(progress.duration)}</Text>
      </View>

      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{musics[index]?.name}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={playPreviousTrack} disabled={trackIndex === 0}>
          <Text style={[styles.controlText, trackIndex === 0 && { color: "gray" }]}>⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlayback}>
          {isPlaying ? <Image source={pausesign} /> : <Image source={playsign} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={playNextTrack} disabled={trackIndex === musics.length - 1}>
          <Text style={[styles.controlText, trackIndex === musics.length - 1 && { color: "gray" }]}>⏭</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AudioFullScreen;
