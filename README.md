# React Youtube Player Component

### Install

```bash
yarn add @wilfredlopez/react-youtube-player
```

`or`

```bash
npm install @wilfredlopez/react-youtube-player
```

### Example

```ts
import { useMemo, useRef, useState } from 'react';
import { ReactYouTube, YouTubePlayerType, PlayerStates } from '@wilfredlopez/react-youtube-player';

interface Props {}

const PLAYER_WIDTH = 540;
const PLAYER_HEIGHT = 360;

interface SongType {
  videoId: string;
  title: string;
  artist: string;
}

const SONGS: SongType[] = [
  {
    videoId: '7szFKgOOt_I',
    title: 'Sin Tu Amor',
    artist: 'Qba Mc',
  },
  {
    videoId: 'CJJfUESHBMs',
    title: 'No Debi',
    artist: 'Wilfred Lopez',
  },
  {
    videoId: 'RCVwXmbelSQ',
    title: 'Quiero Estar Contigo',
    artist: 'Wilfred Lopez',
  },
  {
    videoId: 'JJFfJZad7LQ',
    title: 'Morire Que Dejar De Amarte',
    artist: 'Qba Mc',
  },
];

const getCurrentlyPlaying = (player: YouTubePlayerType | null) => {
  const playerUrl = player?.getVideoUrl();
  if (!playerUrl) {
    return '';
  }
  const currentId = playerUrl.split('v=')[1];
  return currentId;
};

const getState = async function getState(player: YouTubePlayerType | null) {
  const state = await player?.getPlayerState();
  const isPlaying = state === PlayerStates.PLAYING;
  const isPaused =
    state === PlayerStates.PAUSED || state === PlayerStates.VIDEO_CUED || state === PlayerStates.UNSTARTED;
  return {
    isPlaying,
    isPaused,
  };
};

export const Song = (_: Props) => {
  const VIDEO_IDS = useMemo(() => SONGS.map((s) => s.videoId), []);
  const IDSString = useMemo(() => VIDEO_IDS.join(', '), [VIDEO_IDS]);
  const [currentVideo, setCurrentVideo] = useState(VIDEO_IDS[0]);
  const playerRef = useRef<YouTubePlayerType | null>(null);

  async function handleOnClick(isSelected: boolean, s: SongType) {
    if (!isSelected) {
      const index = VIDEO_IDS.indexOf(s.videoId);
      // plays video in the playlist at index
      playerRef.current?.playVideoAt(index);
      setCurrentVideo(s.videoId);
      return;
    }

    const { isPaused } = await getState(playerRef.current);

    if (isPaused && playerRef.current) {
      playerRef.current.playVideo();
    } else {
      //CallPause
      playerRef.current?.pauseVideo();
    }
  }

  return (
    <section>
      <div>
        <ReactYouTube
          videoId={VIDEO_IDS[0]}
          id="wilfred-player"
          containerClassName="max-width-xl"
          className="max-width-xl"
          opts={{
            width: '100%',
            height: PLAYER_HEIGHT,
            playerVars: {
              autoplay: false,
              rel: 0,
              modestbranding: true,
              list: 'playlist',
              listType: 'playlist',
              playlist: IDSString,
            },
          }}
          getPlayerRef={(player) => {
            playerRef.current = player;
          }}
          onPlay={async (e) => {
            const currentId = getCurrentlyPlaying(e.target);
            if (!VIDEO_IDS.includes(currentId)) {
              return;
            }
            if (currentId !== currentVideo) {
              setCurrentVideo(currentId);
            }
          }}
        />
      </div>
      <div>
        <h2>VIDEOS</h2>

        <ul>
          {SONGS.map((s) => {
            const isSelected = s.videoId === currentVideo;
            return (
              <li key={s.videoId}>
                <p isSelected={isSelected}>{s.title}</p>
                <div>
                  <button onClick={() => handleOnClick(isSelected, s)}>Play/Pause</button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
```
