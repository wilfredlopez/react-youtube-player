
export const PlayerStates = {
    BUFFERING: 3,
    ENDED: 0,
    PAUSED: 2,
    PLAYING: 1,
    UNSTARTED: -1,
    VIDEO_CUED: 5
}


export const functionNames = [
    'cueVideoById',
    'loadVideoById',
    'cueVideoByUrl',
    'loadVideoByUrl',
    'playVideo',
    'pauseVideo',
    'stopVideo',
    'getVideoLoadedFraction',
    'cuePlaylist',
    'loadPlaylist',
    'nextVideo',
    'previousVideo',
    'playVideoAt',
    'setShuffle',
    'setLoop',
    'getPlaylist',
    'getPlaylistIndex',
    'setOption',
    'mute',
    'unMute',
    'isMuted',
    'setVolume',
    'getVolume',
    'seekTo',
    'getPlayerState',
    'getPlaybackRate',
    'setPlaybackRate',
    'getAvailablePlaybackRates',
    'getPlaybackQuality',
    'setPlaybackQuality',
    'getAvailableQualityLevels',
    'getCurrentTime',
    'getDuration',
    'removeEventListener',
    'getVideoUrl',
    'getVideoEmbedCode',
    'getOptions',
    'getOption',
    'addEventListener',
    'destroy',
    'setSize',
    'getIframe'
]


export const eventNames = [
    'ready',
    'stateChange',
    'playbackQualityChange',
    'playbackRateChange',
    'error',
    'apiChange',
    'volumeChange'
] as const


export const FunctionStateMap = {
    pauseVideo: {
        acceptableStates: [
            PlayerStates.ENDED,
            PlayerStates.PAUSED
        ],
        stateChangeRequired: false,
        timeout: undefined,
    },
    playVideo: {
        acceptableStates: [
            PlayerStates.ENDED,
            PlayerStates.PLAYING
        ],
        stateChangeRequired: false,
        timeout: 0,
    },
    seekTo: {
        acceptableStates: [
            PlayerStates.ENDED,
            PlayerStates.PLAYING,
            PlayerStates.PAUSED
        ],
        stateChangeRequired: true,

        // TRICKY: `seekTo` may not cause a state change if no buffering is
        // required.
        timeout: 3000
    }
}