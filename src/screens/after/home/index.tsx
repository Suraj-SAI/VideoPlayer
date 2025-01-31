import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import RNFS from 'react-native-fs';
import { styles } from './styles';
import { navigate } from '../../../services/navigationService';
import { Path } from '../../../constants/path';
import { play } from '../../../constants/images';
import Orientation from 'react-native-orientation-locker';
import { requestStoragePermission } from '../../../services/permission';
import { generateThumbnail } from '../../../constants/usefulcalls';
import LoaderScreen from '../../../components/loader';

const Home = () => {
  const [videoFiles, setVideoFiles] = useState<any>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoExtensions = ['mp4', 'mkv', 'avi', 'mov', 'webm', 'flv', 'wmv'];

  const videoPaths = [
    RNFS.DownloadDirectoryPath,
    '/storage/emulated/0/DCIM/Snapchat/',
    '/storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media/WhatsApp Video/',
    '/storage/emulated/0/DCIM/Camera/',
  ];

  const getVideosFromPath = async (path: string) => {
    try {
      const reader = await RNFS?.readDir(path);
      const videos: any = reader?.filter((file) => {
        const fileExtension = file?.name?.split('.').pop()?.toLowerCase();
        return file?.isFile() && fileExtension && videoExtensions?.includes(fileExtension);
      });

      for (const file of videos) {
        const videoData = {
          ...file,
          mtime: new Date(file?.mtime),
          thumbnail: await generateThumbnail(file?.path),
        };

        setVideoFiles((prevVideos: any) => [...prevVideos, videoData]);
      }
    } catch (error) {
      console.error(`Error reading directory ${path}:`, error);
    }
  };

  useEffect(() => {
    const checkPermission = async () => {
      const granted = await requestStoragePermission();
      setHasPermission(granted);
    };

    checkPermission();
  }, []);

  useEffect(() => {
    const loadVideos = async () => {
      if (!hasPermission) return;

      setLoading(true);
      for (const path of videoPaths) {
        await getVideosFromPath(path);
      }
      setLoading(false);
    };

    loadVideos();
  }, [hasPermission]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.videoItem} onPress={() => navigate(Path.FullScreenVideo, { videoUri: `file://${item.path}` })}>
      <Image source={{ uri: item?.thumbnail || play }} style={styles.videoImage} />
      <Text style={styles.videoName} numberOfLines={2} ellipsizeMode="tail">
        {item?.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.videoText}>Videos</Text>
      <View style={styles.line} />

      {loading && videoFiles.length === 0 ? (
        <LoaderScreen visible={loading} />
      ) : videoFiles.length === 0 ? (
        <Text style={styles.noVideosText}>No videos found</Text>
      ) : (
        <FlatList
          data={videoFiles?.sort((a: any, b: any) => b.mtime.getTime() - a.mtime.getTime())}
          renderItem={renderItem}
          keyExtractor={(item) => item.path}
          numColumns={2}
          contentContainerStyle={styles.videoList}
        />
      )}
    </SafeAreaView>
  );
};

export default Home;
