// playbackService.ts
import TrackPlayer, { Event } from 'react-native-track-player';

export const playbackService = async function() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  
  // Fixed RemoteStop handler
  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    TrackPlayer.reset();
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => 
    TrackPlayer.seekTo(position)
  );

  // Android background controls
  TrackPlayer.addEventListener(Event.RemoteDuck, async ({ paused }) => {
    if (paused) {
      await TrackPlayer.pause();
    }
  });
};