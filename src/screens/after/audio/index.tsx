import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, Platform, FlatList, RefreshControl } from 'react-native'
import { styles } from "./styles"
import { exclaim, music, playTime } from '../../../constants/images';
import { navigate } from '../../../services/navigationService';
import { Path } from '../../../constants/path';
import { MMKV } from 'react-native-mmkv';
import RNFS from 'react-native-fs';
import { requestStoragePermission } from '../../../services/permission';
import Orientation from 'react-native-orientation-locker';
import LoaderScreen from '../../../components/loader';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const storage = new MMKV();

const Music = () => {
  const [musicFiles, setMusicFiles] = useState<any>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 44;
  const musicExtensions = ['mp3', 'aac', 'wav', 'flac', 'ogg', 'm4a', 'wma', 'alac', 'opus'];

  const musicPaths = [
    RNFS?.DownloadDirectoryPath,
    "/storage/emulated/0/Music",
    "storage/emulated/0/Android/media/com.Slack/Notifications/",
    '/storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media/WhatsApp Audio/',
    '/storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media/WhatsApp Documents/',
  ]

  useEffect(() => {
    const checkPermission = async () => {
      const granted = await requestStoragePermission();
      setHasPermission(granted)
    }
    checkPermission();

    const savedMusic = storage?.getString('music');
    if (savedMusic) {
      setMusicFiles(JSON?.parse(savedMusic));
    }

    Orientation.lockToPortrait();
  }, [])

  useEffect(() => {
    loadMusic();
  }, [hasPermission]);


  const loadMusic = async () => {
    if (!hasPermission) return;

    setLoading(true);

    let allCurrentMusicPaths = new Set();

    for (const path of musicPaths) {
      try {
        const reader: any = await RNFS?.readDir(path);
        const music: any = reader?.filter((file: any) => {
          const fileExtension = file?.name?.split('.')?.pop()?.toLowerCase();
          return file?.isFile() && fileExtension && musicExtensions?.includes(fileExtension);
        });

        music?.forEach((file: any) => allCurrentMusicPaths?.add(file.path));

        for (const file of music) {
          const alreadyExists = musicFiles?.some((v: any) => v?.path === file?.path);
          if (alreadyExists) continue;

          const musicData = {
            ...file,
            mtime: new Date(file?.mtime),
          };

          setMusicFiles((prevMusics: any) => {
            const musicfiles = [...prevMusics, musicData];
            storage?.set('music', JSON?.stringify(musicfiles));
            return musicfiles;
          });
        }
      } catch (error) {
        console.error(`Error reading directory ${path}:`, error);
      }
    }

    setMusicFiles((prevMusics: any) => {
      const musicUpdate = prevMusics.filter((music: any) => allCurrentMusicPaths?.has(music?.path));
      storage.set('music', JSON?.stringify(musicUpdate));
      return musicUpdate;
    });
    setLoading(false);
  };

  const refreshMusic = useCallback(async () => {
    setRefreshing(true);
    await loadMusic();
    setRefreshing(false);
  }, [musicFiles]);


  const renderItem = ({ item, index }: any) => {
    return (
      <TouchableOpacity
        style={[styles.videoItem, index + 1 === musicFiles.length ? { marginBottom: hp(8) } : {}]}
        onPress={() => navigate(Path?.MUSICFULLSCREEN, { musicUri: `file://${item.path}`, musics: musicFiles, index: index })}
      >
        <Image
          source={music}
          style={styles?.videoImage} />
        <Text style={styles.videoName} numberOfLines={2} ellipsizeMode="tail">
          {item?.name}
        </Text>
      </TouchableOpacity>
    )
  };

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

      {loading && musicFiles.length === 0 ? (
        <LoaderScreen visible={loading} />
      ) : musicFiles?.length === 0 ? (
        <Text style={styles.noVideosText}>No Music Found</Text>
      ) : (
        <FlatList
          data={musicFiles?.sort((a: any, b: any) => {
            const timeA = a?.mtime instanceof Date ? a?.mtime?.getTime() : 0;
            const timeB = b?.mtime instanceof Date ? b?.mtime?.getTime() : 0;
            return timeB - timeA;
          })}
          renderItem={renderItem}
          keyExtractor={(item) => item?.path}
          numColumns={2}
          contentContainerStyle={styles.videoList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshMusic} enabled={!loading} />
          }
        />
      )}
    </View>
  )
}

export default Music