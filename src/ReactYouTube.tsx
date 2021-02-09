import { useCallback, useEffect, useRef, useState } from 'react'
import createYouTubePlayer, { PlayerStates } from './youtube-player'
import type { YouTubePlayerInterface, OptionsType, EventType } from './youtube-player'
import { YouTubePlayerType } from './youtube-player/types'

interface Props {
    videoId: string
    id: string
    className?: string
    opts?: Omit<OptionsType, 'events'>

    // custom class name for player container element
    containerClassName?: string

    /**
     * Returns a reference to the player so you can use the api from the outside.
     * @example
     *  const playerRef = useRef<YouTubePlayerType | null>(null)
     * 
     * <ReactYouTube
     *     videoId={VIDEO_IDS[0]}
     *     id="my-player"
     *     getPlayerRef={(player) => {
     *         playerRef.current = player
     *     }}
     *     />
     */
    getPlayerRef?: (player: YouTubePlayerType) => void


    // event subscriptions
    onReady?: (event: EventType) => void,
    onError?: (event: EventType) => void,
    onPlay?: (event: EventType) => void,
    onPause?: (event: EventType) => void,
    onEnd?: (event: EventType) => void,
    onStateChange?: (event: EventType) => void,
    onPlaybackRateChange?: (event: EventType) => void,
    onPlaybackQualityChange?: (event: EventType) => void,
}






export const ReactYouTube = (props: Props) => {

    /*-----------------------------------
      * STATE & REFS
      ------------------------------------*/
    const [internalPlayer, setInternalPlayer] = useState<YouTubePlayerInterface | null>(null)
    // const internalPlayer = useRef<YouTubePlayerInterface | null>(null)
    const container = useRef<HTMLDivElement | null>(null)


    /*-----------------------------------
     * CALLBACKS
     ------------------------------------*/

    const callPropFunction = useCallback(function callPropFunction(fn: ((event: EventType) => void) | undefined, event: EventType) {
        if (fn) {
            fn(event)
        }
    }, [])

    /**
    * https://developers.google.com/youtube/iframe_api_reference#onReady
    */
    const onPlayerReady = useCallback(
        (event: EventType) => callPropFunction(props.onReady, event), [callPropFunction, props.onReady])

    /**
    * https://developers.google.com/youtube/iframe_api_reference#onReady
    */
    const onPlayerError = useCallback(
        (event: EventType) => callPropFunction(props.onError, event),
        [callPropFunction, props.onError])

    /**
     * https://developers.google.com/youtube/iframe_api_reference#onStateChange
     */
    const onPlayerStateChange = useCallback((event: EventType) => {
        const onStateChange = props.onStateChange
        if (onStateChange) {
            onStateChange(event)
        }
        switch (event.data) {
            case PlayerStates.ENDED:
                callPropFunction(props.onEnd, event)
                break

            case PlayerStates.PLAYING:
                callPropFunction(props.onPlay, event)
                break

            case PlayerStates.PAUSED:
                callPropFunction(props.onPause, event)
                break

            default:
                break
        }
    }, [callPropFunction, props.onStateChange, props.onPause, props.onPlay, props.onEnd])

    /**
    * https://developers.google.com/youtube/iframe_api_reference#onReady
    */
    const onPlayerPlaybackRateChange = useCallback(
        (event: EventType) => callPropFunction(props.onPlaybackRateChange, event),
        [callPropFunction, props.onPlaybackRateChange])

    /**
    * https://developers.google.com/youtube/iframe_api_reference#onReady
    */
    const onPlayerPlaybackQualityChange = useCallback(
        (event: EventType) => callPropFunction(props.onPlaybackQualityChange, event),
        [callPropFunction, props.onPlaybackQualityChange])




    /*-----------------------------------
      * EFFECTS
      ------------------------------------*/
    /**
     *  ComponentDidMount
     */
    useEffect(() => {
        /**
     * Initialize the YouTube Player API on the container and attach event handlers
    */
        const createPlayer = async () => {
            const videoId = props.videoId || props.opts?.videoId || ''
            // do not attempt to create a player server-side, it won't work
            if (typeof document === 'undefined' || container.current === null) return
            // create player
            const playerOpts = {
                ...props.opts,
                // preload the `videoId` video if one is already given
                videoId: videoId,
            }

            const player = await createYouTubePlayer(container.current, playerOpts)
            player.on('ready', onPlayerReady)
            player.on('error', onPlayerError)
            player.on('stateChange', onPlayerStateChange)
            player.on('playbackRateChange', onPlayerPlaybackRateChange)
            player.on('playbackQualityChange', onPlayerPlaybackQualityChange)

            // internalPlayer.current = player
            setInternalPlayer(player)
        }
        createPlayer()
    }, [props.opts, props.videoId, onPlayerReady, onPlayerError, onPlayerStateChange, onPlayerPlaybackRateChange, onPlayerPlaybackQualityChange])


    //update the player ref
    useEffect(() => {
        const getPlayer = props.getPlayerRef
        if (getPlayer && internalPlayer) {
            getPlayer(internalPlayer)
        }
    }, [internalPlayer, props.getPlayerRef])

    /**
     * update id and className if props change
     */
    useEffect(() => {
        /**
         * Method to update the id and class of the YouTube Player iframe.
         * React should update this automatically but since the YouTube Player API
         * replaced the DIV that is mounted by React we need to do this manually.
         */
        async function updatePlayer() {
            // const player = internalPlayer.current
            const player = internalPlayer
            if (!player) {
                return
            }
            const iframe = await player.getIframe()
            if (!iframe) {
                return
            }
            if (props.id) iframe.setAttribute('id', props.id)
            else iframe.removeAttribute('id')
            if (props.className) iframe.setAttribute('class', props.className)
            else iframe.removeAttribute('class')
        }
        updatePlayer()
        //Not adding internalPlayer as dependency
        //eslint-disable-next-line
    }, [props.className, props.id, internalPlayer])


    useEffect(() => {
        /**
         * Call YouTube Player API methods to update the currently playing video.
         * Depending on the `opts.playerVars.autoplay` this function uses one of two
         * YouTube Player API methods to update the video.
         */
        function updateVideo() {
            // const player = internalPlayer.current
            const player = internalPlayer
            const videoId = props.videoId || props.opts?.videoId || ''
            if (!player) {
                return
            }
            if (typeof videoId === 'undefined' || videoId === null) {
                player?.stopVideo()
                return
            }

            // set queueing options
            const autoplay = props.opts?.playerVars?.autoplay ?? false
            const opts: {
                startSeconds?: number
                endSeconds?: number
                videoId: string
            } = {
                videoId: videoId
            }

            if (props.opts) {

                if (props.opts.playerVars) {
                    if (props.opts.playerVars.start) {
                        opts.startSeconds = props.opts.playerVars.start
                    }

                    if (props.opts.playerVars.end) {
                        opts.endSeconds = props.opts.playerVars.end
                    }
                }
            }
            // if autoplay is enabled loadVideoById
            if (autoplay) {
                player.loadVideoById(opts)
                return
            }
            // default behaviour just cues the video
            player.cueVideoById(opts)
        }
        updateVideo()
        //eslint-disable-next-line
    }, [props.opts?.playerVars?.autoplay])


    return (
        <div className={props.containerClassName}>
            <div id={props.id} className={props.className} ref={container} />
        </div>
    )
}




export default ReactYouTube