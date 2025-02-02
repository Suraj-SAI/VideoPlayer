import { createThumbnail } from 'react-native-create-thumbnail';
import RNFS from 'react-native-fs';
// import { RNFFmpeg } from 'react-native-ffmpeg';

export const generateThumbnail = async (videoPath: string) => {
  try {
    const thumbnail = await createThumbnail({
      url: `file://${videoPath}`,
      timeStamp: 1000, // Capture at 1 second
    });
    return thumbnail.path; // Return the thumbnail path
  } catch (error) {
    console.error("Thumbnail generation error:", error);
    return null; // Return null if thumbnail generation fails
  }
};

// Extracts subtitle from a video file using ffmpeg
export const getSubtitleFile = async (videoFilePath: string) => {
  const subtitleFilePath = `${RNFS.CachesDirectoryPath}/subtitle.srt`; // Temporary location for subtitle file

  try {
    // Run ffmpeg command to extract subtitles (if any)
    const command = `-i ${videoFilePath} -map 0:s:0 ${subtitleFilePath}`; // Extract the first subtitle stream
    const result : any = await RNFFmpeg.execute(command); // Correct method for executing FFmpeg command

    // Check if subtitles were successfully extracted
    if (result?.returnCode === 0 && await RNFS.exists(subtitleFilePath)) {
      return subtitleFilePath; // Return the subtitle file path if successful
    } else {
      return null; // No subtitle found
    }
  } catch (error) {
    console.error('Error extracting subtitle:', error);
    return null; // Return null in case of any error
  }
};

// Extracts audio from a video file using ffmpeg and converts it to MP3 format
export const getAudioFile = async (videoFilePath: string) => {
  const audioFilePath = `${RNFS.CachesDirectoryPath}/audio.mp3`; // Temporary location for audio file

  try {
    // Run ffmpeg command to extract audio and convert it to MP3
    const command = `-i ${videoFilePath} -vn -acodec libmp3lame -ar 44100 -ac 2 -ab 192k -f mp3 ${audioFilePath}`; // Extract audio and convert to MP3
    const result: any = await RNFFmpeg.execute(command); // Correct method for executing FFmpeg command

    // Check if audio was successfully extracted
    if (result.returnCode === 0 && await RNFS.exists(audioFilePath)) {
      return audioFilePath; // Return the audio file path if successful
    } else {
      return null; // No audio found
    }
  } catch (error) {
    console.error('Error extracting audio:', error);
    return null; // Return null in case of any error
  }
};