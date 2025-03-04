import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl, StatusBar, Platform } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import RNFS from 'react-native-fs';
import { styles } from './styles';
import { navigate } from '../../../services/navigationService';
import { Path } from '../../../constants/path';
import { exclaim, play, playTime } from '../../../constants/images';
import { requestStoragePermission } from '../../../services/permission';
import { generateThumbnail } from '../../../constants/usefulcalls';
import LoaderScreen from '../../../components/loader';
import { MMKV } from 'react-native-mmkv';
import Orientation from 'react-native-orientation-locker';
import ImmersiveMode from 'react-native-immersive-mode';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const storage = new MMKV();

const Home = () => {
  const [videoFiles, setVideoFiles] = useState<any>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const videoExtensions = ['mp4', 'mkv', 'avi', 'mov', 'webm', 'flv', 'wmv'];
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 44;

  const videoPaths = [
    RNFS?.DownloadDirectoryPath,
    '/storage/emulated/0/DCIM/Snapchat/',
    '/storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media/WhatsApp Video/',
    '/storage/emulated/0/DCIM/Camera/',
    "/storage/emulated/0/DCIM/ScreenRecorder/",
    "/storage/emulated/0/Movies/Instagram/",
    "/storage/emulated/0/Movies/Telegram/"
  ];

  useEffect(() => {
    const checkPermission = async () => {
      const granted = await requestStoragePermission();
      setHasPermission(granted);
    };

    checkPermission();


    const savedVideos = storage?.getString('videos');
    if (savedVideos) {
      setVideoFiles(JSON?.parse(savedVideos));
    }

    Orientation.lockToPortrait();

  }, []);

  const loadVideos = async () => {
    if (!hasPermission) return;

    setLoading(true);

    let allCurrentVideoPaths = new Set();

    for (const path of videoPaths) {
      try {
        const reader: any = await RNFS?.readDir(path);
        const videos: any = reader?.filter((file: any) => {
          const fileExtension = file?.name?.split('.')?.pop()?.toLowerCase();
          return file?.isFile() && fileExtension && videoExtensions?.includes(fileExtension);
        });

        videos?.forEach((file: any) => allCurrentVideoPaths?.add(file.path));

        for (const file of videos) {
          const alreadyExists = videoFiles?.some((v: any) => v?.path === file?.path);
          if (alreadyExists) continue;

          const videoData = {
            ...file,
            mtime: new Date(file?.mtime),
            thumbnail: await generateThumbnail(file?.path),
          };

          setVideoFiles((prevVideos: any) => {
            const updatedVideos = [...prevVideos, videoData];
            storage?.set('videos', JSON?.stringify(updatedVideos));
            return updatedVideos;
          });
        }
      } catch (error) {
        console.error(`Error reading directory ${path}:`, error);
      }
    }

    setVideoFiles((prevVideos: any) => {
      const updatedVideos = prevVideos.filter((video: any) => allCurrentVideoPaths?.has(video?.path));
      storage.set('videos', JSON?.stringify(updatedVideos));
      return updatedVideos;
    });
    setLoading(false);
  };

  useEffect(() => {
    loadVideos();
  }, [hasPermission]);


  const refreshVideos = useCallback(async () => {
    setRefreshing(true);
    await loadVideos();
    setRefreshing(false);
  }, [videoFiles]);

  const renderItem = ({ item, index }: any) => {
    return (
      <TouchableOpacity
        style={[styles.videoItem, index + 1 === videoFiles.length ? { marginBottom: hp(8) , backgroundColor : "red" } : {}]}
        onPress={() => navigate(Path?.FullScreenVideo, { videoUri: `file://${item.path}` })}
      >
        <View style={styles.textContainer}>
          <Text style={styles.videoName} numberOfLines={2} ellipsizeMode="tail">
            {item?.name}
          </Text>
        </View>
        <Image
          source={item?.thumbnail ? { uri: item.thumbnail } : play}
          style={styles?.videoImage} />
      </TouchableOpacity>
    )
  };

  useEffect(() => {
    StatusBar.setHidden(true)
    ImmersiveMode.fullLayout(true);
    ImmersiveMode.setBarMode('Full');
  }, [])

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

      {loading && videoFiles.length === 0 ? (
        <LoaderScreen visible={loading} />
      ) : videoFiles?.length === 0 ? (
        <Text style={styles.noVideosText}>No videos found</Text>
      ) : (
        <FlatList
          data={videoFiles?.sort((a: any, b: any) => {
            const timeA = a?.mtime instanceof Date ? a?.mtime?.getTime() : 0;
            const timeB = b?.mtime instanceof Date ? b?.mtime?.getTime() : 0;
            return timeB - timeA;
          })}
          renderItem={renderItem}
          keyExtractor={(item) => item?.path}
          numColumns={2}
          contentContainerStyle={styles.videoList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshVideos} enabled={!loading} />
          }
        />
      )}
    </View>
  );
};

export default Home;
