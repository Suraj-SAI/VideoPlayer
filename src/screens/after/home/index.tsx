import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import RNFS from 'react-native-fs';
import { styles } from './styles';
import { navigate } from '../../../services/navigationService';
import { Path } from '../../../constants/path';
import { play } from '../../../constants/images';
import { requestStoragePermission } from '../../../services/permission';
import { generateThumbnail } from '../../../constants/usefulcalls';
import LoaderScreen from '../../../components/loader';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const Home = () => {
  const [videoFiles, setVideoFiles] = useState<any>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const videoExtensions = ['mp4', 'mkv', 'avi', 'mov', 'webm', 'flv', 'wmv'];

  const videoPaths = [
    RNFS.DownloadDirectoryPath,
    '/storage/emulated/0/DCIM/Snapchat/',
    '/storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media/WhatsApp Video/',
    '/storage/emulated/0/DCIM/Camera/',
  ];

  useEffect(() => {
    const checkPermission = async () => {
      const granted = await requestStoragePermission();
      setHasPermission(granted);
    };

    checkPermission();

    const savedVideos = storage.getString('videos');
    if (savedVideos) {
      setVideoFiles(JSON.parse(savedVideos));
    }

  }, []);

  const loadVideos = async () => {
    if (!hasPermission) return;
  
    setLoading(true);
  
    // Initialize a set to track existing files in videoPaths
    let allCurrentVideoPaths = new Set();
  
    for (const path of videoPaths) {
      try {
        const reader: any = await RNFS.readDir(path);
        const videos: any = reader?.filter((file:any) => {
          const fileExtension = file?.name?.split('.').pop()?.toLowerCase();
          return file?.isFile() && fileExtension && videoExtensions?.includes(fileExtension);
        });
  
        // Add current videos to the set
        videos.forEach((file: any) => allCurrentVideoPaths.add(file.path));
  
        // Fetch each video one by one
        for (const file of videos) {
          const alreadyExists = videoFiles.some((v: any) => v?.path === file?.path);
          if (alreadyExists) continue;
  
          const videoData = {
            ...file,
            mtime: new Date(file?.mtime),
            thumbnail: await generateThumbnail(file?.path),
          };
  
          // Append new video data to the current video list
          setVideoFiles((prevVideos: any) => {
            const updatedVideos = [...prevVideos, videoData];
            
            // Save the updated video list to MMKV storage
            storage.set('videos', JSON.stringify(updatedVideos));
            return updatedVideos;
          });
        }
      } catch (error) {
        console.error(`Error reading directory ${path}:`, error);
      }
    }
  
    // Handle deletion: Filter out videos that are no longer in the file system
    setVideoFiles((prevVideos: any) => {
      const updatedVideos = prevVideos.filter((video: any) => allCurrentVideoPaths.has(video?.path));
      
      // Update the storage with the filtered video list
      storage.set('videos', JSON.stringify(updatedVideos));
      return updatedVideos;
    });
  
    setLoading(false);
  };
  
  

  useEffect(() => {
    loadVideos();
  }, [hasPermission]);

  const refreshVideos = useCallback(async () => {
    setRefreshing(true);
    await loadVideos();  // Incrementally add new videos without clearing existing ones
    setRefreshing(false);
  }, [videoFiles]);

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
          data={videoFiles.sort((a: any, b: any) => {
            const timeA = a?.mtime instanceof Date ? a?.mtime?.getTime() : 0;
            const timeB = b?.mtime instanceof Date ? b?.mtime?.getTime() : 0;
            return timeB - timeA;
          })}
          renderItem={renderItem}
          keyExtractor={(item) => item.path}
          numColumns={2}
          contentContainerStyle={styles.videoList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshVideos} />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Home;
