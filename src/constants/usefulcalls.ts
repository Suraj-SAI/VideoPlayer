import { createThumbnail } from 'react-native-create-thumbnail';

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
  