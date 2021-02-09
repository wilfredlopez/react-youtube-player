# React Youtube Player Component

## Install

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
import {
  ReactYouTube,
  YouTubePlayerType,
  PlayerStates,
  getPlayerState,
  getCurrentlyPlayingIdId,
} from '@wilfredlopez/react-youtube-player';

interface Props {}
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

export const Example = (_: Props) => {
  const VIDEO_IDS = useMemo(() => SONGS.map((s) => s.videoId), []);
  const IDSString = useMemo(() => VIDEO_IDS.join(', '), [VIDEO_IDS]);
  const [currentVideo, setCurrentVideo] = useState(VIDEO_IDS[0]);
  const playerRef = useRef<YouTubePlayerType | null>(null);

  function handleOnClick(isSelected: boolean, s: SongType) {
    if (!isSelected) {
      const index = VIDEO_IDS.indexOf(s.videoId);

      // plays video in the playlist at index
      playerRef.current?.playVideoAt(index);
      setCurrentVideo(s.videoId);
      return;
    }

    const { isPaused } = getPlayerState(playerRef.current);

    if (isPaused && playerRef.current) {
      playerRef.current.playVideo();
    } else {
      //CallPause
      playerRef.current?.pauseVideo();
    }
  }

  return (
    <div>
      <section>
        <ReactYouTube
          videoId={VIDEO_IDS[0]}
          disableAutoLoad={true}
          id="wilfred-player"
          containerClassName="max-width-xl"
          className="max-width-xl"
          autoPlay={false}
          playerVars={{
            //just provide related videos to user
            rel: 0,
            //remove controls
            // controls: 1,
            modestbranding: true,
            list: 'playlist',
            listType: 'playlist',
          }}
          playlist={IDSString}
          opts={{
            width: '100%',
            height: PLAYER_HEIGHT,
          }}
          getPlayerRef={(player) => {
            playerRef.current = player;
          }}
          onPlay={async (e) => {
            const currentId = getCurrentlyPlayingId(e.target);

            // const index = await e.target.getPlaylistIndex()
            if (!VIDEO_IDS.includes(currentId)) {
              return;
            }
            if (currentId !== currentVideo) {
              setCurrentVideo(currentId);
            }
          }}
        />
      </section>
      <section>
        <h2>Instrumentales</h2>

        <ul
          style={{
            listStyle: 'none',
          }}
        >
          {SONGS.map((s) => {
            const isSelected = s.videoId === currentVideo;
            return (
              <li key={s.videoId}>
                <p
                  style={{
                    color: isSelected ? 'red' : 'inherit',
                  }}
                >
                  {s.title}
                </p>
                <div>
                  <button onClick={() => handleOnClick(isSelected, s)}>Play/Pause</button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};
```
