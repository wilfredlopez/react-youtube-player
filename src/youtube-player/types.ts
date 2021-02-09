declare global {
    interface Window {
        YT: any
        onYouTubeIframeAPIReady: any
        YouTubePlayer: any
    }
}


export type EmitterType = {
    trigger: (eventName: string, event: Object) => void
}

export type IframeApiType = {
    Player: ({ new(...args: any[]): any })
}

type QueuePlaylistOutput = {
    listType?: "user_uploads" | "playlist",
    list: string,
    index?: number,
    startSeconds?: number,
    suggestedQuality?: string
}


type LoadPlaylistOutput = {
    listType?: "playlist" | "user_uploads",
    list: string,
    index?: number,
    startSeconds?: number,
    suggestedQuality?: string
}

type QueueVideoIdOutput = {
    videoId?: string,
    startSeconds?: number,
    endSeconds?: number,
    suggestedQuality?: string
}

type QueueVideoUrlOutput = {
    mediaContentUrl: string,
    startSeconds?: number,
    endSeconds?: number,
    suggestedQuality?: string
}

type LoadVideoByUrlOutput = {
    mediaContentUrl: string,
    startSeconds?: number,
    endSeconds?: number,
    suggestedQuality?: string
}

type LoadVideoByIdOutput = {
    videoId: string,
    startSeconds?: number,
    endSeconds?: number,
    suggestedQuality?: string
}

export interface EventType {
    data: number,
    target: YouTubePlayerType
}

export type EventHandlerMapType = {
    [key: string]: (event: EventType) => void
}

/**
 * https://developers.google.com/youtube/iframe_api_reference
 */
export type YouTubePlayerType = {
    getCurrentTime: () => number,
    getDuration: () => number,
    getPlaylist: () => ReadonlyArray<string>,
    getPlaylistIndex: () => number,
    getVideoUrl: () => string,
    // getVideoUrl: () => Promise<string>,
    // getPlayerState: () => Promise<number>,
    destroy: () => Promise<void>,
    getPlayerState: () => number,
    // getVolume: () => Promise<number>,
    getVolume: () => number,
    isMuted: () => boolean,
    mute: () => void,
    addEventListener: (event: string, listener: (event: EventType) => void, scope?: object) => void,
    getAvailablePlaybackRates: () => ReadonlyArray<number>,
    getAvailableQualityLevels: () => ReadonlyArray<string>,
    getIframe: () => Promise<HTMLIFrameElement>,
    getOption: () => any,
    getOptions: () => Promise<string[]>,
    setOption: (name: string, value: any) => Promise<any>,
    setOptions: () => void,
    cuePlaylist: (opts: QueuePlaylistOutput) => void,
    loadPlaylist: (opts: LoadPlaylistOutput) => void,
    getPlaybackQuality: () => Promise<string>,
    getPlaybackRate: () => Promise<number>,

    getVideoEmbedCode: () => Promise<string>,
    getVideoLoadedFraction: () => Promise<number>,

    cueVideoById: (opts: QueueVideoIdOutput) => Promise<void>,
    cueVideoByUrl: (opts: QueueVideoUrlOutput) => Promise<void>,
    loadVideoByUrl: (opts: LoadVideoByUrlOutput) => Promise<void>,
    loadVideoById: (opts: LoadVideoByIdOutput) => Promise<void>,

    nextVideo: () => void,
    pauseVideo: () => void,
    playVideo: () => void,
    playVideoAt: (index: number) => void,
    previousVideo: () => void,
    removeEventListener: (event: string, listener: Function) => void,
    seekTo: (seconds: number, allowSeekAhead?: boolean) => void,
    setLoop: (loopPlaylists: boolean) => void,
    setPlaybackQuality: (suggestedQuality: string) => void,
    setPlaybackRate: (suggestedRate: number) => void,
    setShuffle: (shufflePlaylist: boolean) => void,
    setSize: (width: number, height: number) => Object,
    setVolume: (volume: number) => void,
    stopVideo: () => void,
    unMute: () => void
    getSphericalProperties: () => SphericalProperties
    setSphericalProperties: (properties: SphericalProperties & { enableOrientationSensor?: boolean }) => void
}

interface SphericalProperties {
    /**
     * 	A number in the range [0, 360) that represents the horizontal angle of the view in degrees
     */
    yaw: number
    /**
     * A number in the range [-90, 90] that represents the vertical angle of the view in degrees
     */
    pitch: number
    /**
     * A number in the range [-180, 180]
     */
    roll: number
    /**
     * 	A number in the range [30, 120] that represents the field-of-view of the view in degrees
     */
    fov: number
}