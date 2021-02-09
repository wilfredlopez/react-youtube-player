import type { YouTubePlayerType } from './youtube-player/types'
import { PlayerStates } from './youtube-player'

export const getCurrentlyPlayingId = (player: YouTubePlayerType | null) => {
    const playerUrl = player?.getVideoUrl()
    if (!playerUrl) {
        return ''
    }
    const currentId = playerUrl.split('v=')[1]
    return currentId
}

export function getPlayerState(player: YouTubePlayerType | null) {
    const state = player?.getPlayerState()
    const isBuffering = state === PlayerStates.BUFFERING
    const ended = state === PlayerStates.ENDED
    const isPlaying = state === PlayerStates.PLAYING
    const isPaused = state === PlayerStates.PAUSED || state === PlayerStates.VIDEO_CUED || state === PlayerStates.UNSTARTED
    return {
        isPlaying, isPaused, ended, isBuffering
    }
}
