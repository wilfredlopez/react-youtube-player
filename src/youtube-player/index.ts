
import EventsProxy from './EventsProxy'
import loadYouTubeIframeApi from './loadYouTubeIframeApi'
import YouTubePlayer from './YouTubePlayer'
import type {
    YouTubePlayerType,
    IframeApiType,
} from './types'
export { PlayerStates } from './constants'
export type { EventType } from './types'
/**
 * @see https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player
 */


type BooleanType = 0 | 1 | boolean

export interface PlayerVars {
    autoplay?: BooleanType
    color?: string
    controls?: BooleanType
    list?: 'user_uploads' | 'playlist'
    listType?: 'user_uploads' | 'playlist'
    loop?: BooleanType,
    origin?: string
    playlist?: string
    start?: number,
    end?: number
    disablekb?: BooleanType
    /**
     * 	Setting this parameter to 0 prevents the fullscreen button from displaying in the player. The default value is 1, which causes the fullscreen button to display.
     */
    fs?: BooleanType
    modestbranding?: BooleanType,
    rel?: BooleanType,
    widget_referrer?: string,
}

export type OptionsType = {
    playerVars?: PlayerVars,
    videoId?: string,
    events?: Object,
    height?: number,
    width?: number | string
}

/**
 * @typedef YT.Player
 * @see https://developers.google.com/youtube/iframe_api_reference
 * */

var youtubeIframeAPI: Promise<IframeApiType>


export type YouTubePlayerInterface = EventsProxy & YouTubePlayerType

/**
 * A factory function used to produce an instance of YT.Player and queue function calls and proxy events of the resulting object.
 *
 * @param maybeElementId Either An existing YT.Player instance,
 * the DOM element or the id of the HTML element where the API will insert an <iframe>.
 * @param options See `options` (Ignored when using an existing YT.Player instance).
 * @param strictState A flag designating whether or not to wait for
 * an acceptable state when calling supported functions. Default: `false`.
 * See `FunctionStateMap.js` for supported functions and acceptable states.
 */

async function getPlayer(maybeElementId: YouTubePlayerType | string | any, options: OptionsType = {}, strictState: boolean = false) {
    const emitter = new EventsProxy()


    if (!youtubeIframeAPI) {
        youtubeIframeAPI = loadYouTubeIframeApi(emitter)
    }

    if (options.events) {
        throw new Error('Event handlers cannot be overwritten.')
    }

    if (typeof maybeElementId === 'string' && !document.getElementById(maybeElementId)) {
        throw new Error('Element "' + maybeElementId + '" does not exist.')
    }

    options.events = YouTubePlayer.proxyEvents(emitter)

    const playerAPIReady = new Promise<YouTubePlayerType>((resolve) => {
        if (typeof maybeElementId === 'object' && maybeElementId.playVideo instanceof Function) {
            const player: YouTubePlayerType = maybeElementId as YouTubePlayerType

            resolve(player)
            return
        } else {
            // asume maybeElementId can be rendered inside
            return youtubeIframeAPI
                .then((YT) => {
                    const player: YouTubePlayerType = new YT.Player(maybeElementId, { ...options.playerVars, ...options })

                    emitter.on('ready', () => {
                        resolve(player)
                    })

                })
        }
    })

    // const playerApi: YouTubePlayerInterface = YouTubePlayer.promisifyPlayer(playerAPIReady, strictState) as any
    const playerApi: YouTubePlayerInterface = await YouTubePlayer.awaitPlayer(playerAPIReady, strictState) as any


    //END NEW WAY
    playerApi.on = emitter.on.bind(emitter)
    playerApi.off = emitter.off.bind(emitter)

    window.YouTubePlayer = playerApi
    return playerApi
}


export default getPlayer