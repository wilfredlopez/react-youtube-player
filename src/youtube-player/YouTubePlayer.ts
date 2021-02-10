
import { eventNames, functionNames, FunctionStateMap } from './constants'
import type {
    EmitterType,
    YouTubePlayerType,
    EventType,
    EventHandlerMapType
} from './types'




let timeout: NodeJS.Timeout | null = null


var YouTubePlayer = {
    proxyEvents: (emitter: EmitterType): EventHandlerMapType => {
        const events: Record<string, (e: EventType) => void> = {} as any
        const trigger = emitter.trigger.bind(emitter)
        for (const eventName of eventNames) {
            const onEventName = 'on' + eventName.slice(0, 1).toUpperCase() + eventName.slice(1)

            events[onEventName] = (event: EventType) => {
                trigger(eventName, event)
            }
        }

        return events
    },
    promisifyPlayer: (playerAPIReady: Promise<YouTubePlayerType>, strictState: boolean = false) => {
        const functions: YouTubePlayerType = {} as any
        for (const functionName of functionNames) {

            const name = FunctionStateMap[functionName as keyof typeof FunctionStateMap]
            if (strictState && name) {
                //@ts-ignore
                functions[functionName] = (...args: any[]) => {
                    return playerAPIReady
                        .then((player) => {
                            const stateInfo = name
                            const playerState = player.getPlayerState() as any

                            // eslint-disable-next-line no-warning-comments
                            // TODO: Just spread the args into the function once Babel is fixed:
                            // https://github.com/babel/babel/issues/4270
                            //
                            // eslint-disable-next-line prefer-spread
                            if (player[functionName as 'addEventListener'] === undefined) {
                                return
                            }
                            const value = player[functionName as 'addEventListener'].apply(player, args as any)

                            // TRICKY: For functions like `seekTo`, a change in state must be
                            // triggered given that the resulting state could match the initial
                            // state.
                            if (
                                stateInfo.stateChangeRequired ||

                                // eslint-disable-next-line no-extra-parens
                                (
                                    Array.isArray(stateInfo.acceptableStates) &&
                                    stateInfo.acceptableStates.indexOf(playerState) === -1
                                )
                            ) {
                                return new Promise<void>((resolve) => {
                                    const onPlayerStateChange = () => {
                                        const playerStateAfterChange = player.getPlayerState() as any

                                        if (timeout) {
                                            clearTimeout(timeout)
                                        }

                                        if (typeof stateInfo.timeout === 'number') {
                                            timeout = setTimeout(() => {
                                                player.removeEventListener('onStateChange', onPlayerStateChange)

                                                resolve()
                                            }, stateInfo.timeout)
                                        }

                                        if (
                                            Array.isArray(stateInfo.acceptableStates) &&
                                            stateInfo.acceptableStates.indexOf(playerStateAfterChange) !== -1
                                        ) {
                                            player.removeEventListener('onStateChange', onPlayerStateChange)

                                            if (timeout) {
                                                clearTimeout(timeout)
                                            }
                                            resolve()
                                        }
                                    }

                                    player.addEventListener('onStateChange', onPlayerStateChange)
                                })
                                    .then(() => {
                                        return value
                                    })
                            }

                            return value
                        })
                }
            } else {
                //@ts-ignore
                functions[functionName] = (...args: any[]) => {
                    return playerAPIReady
                        .then((player) => {
                            // eslint-disable-next-line no-warning-comments
                            // TODO: Just spread the args into the function once Babel is fixed:
                            // https://github.com/babel/babel/issues/4270
                            //
                            if (player[functionName as 'addEventListener'] === undefined) {
                                return
                            }
                            // eslint-disable-next-line prefer-spread
                            return player[functionName as 'addEventListener'].apply(player, args as any)
                        })
                }
            }


        }

        return functions
    },
    awaitPlayer: async (playerAPIReady: Promise<YouTubePlayerType>, strictState: boolean = false) => {
        const functions: YouTubePlayerType = {} as any


        for (const functionName of functionNames) {

            const name = FunctionStateMap[functionName as keyof typeof FunctionStateMap]
            if (strictState && name) {
                //@ts-ignore
                functions[functionName] = (...args: any[]) => {
                    return playerAPIReady
                        .then((player) => {
                            const stateInfo = name
                            const playerState = player.getPlayerState() as any

                            // eslint-disable-next-line no-warning-comments
                            // TODO: Just spread the args into the function once Babel is fixed:
                            // https://github.com/babel/babel/issues/4270
                            //
                            // eslint-disable-next-line prefer-spread
                            if (player[functionName as 'addEventListener'] === undefined) {
                                return
                            }
                            const value = player[functionName as 'addEventListener'].apply(player, args as any)

                            // TRICKY: For functions like `seekTo`, a change in state must be
                            // triggered given that the resulting state could match the initial
                            // state.
                            if (
                                stateInfo.stateChangeRequired ||

                                // eslint-disable-next-line no-extra-parens
                                (
                                    Array.isArray(stateInfo.acceptableStates) &&
                                    stateInfo.acceptableStates.indexOf(playerState) === -1
                                )
                            ) {
                                return new Promise<void>((resolve) => {
                                    const onPlayerStateChange = () => {
                                        const playerStateAfterChange = player.getPlayerState() as any

                                        if (timeout) {
                                            clearTimeout(timeout)
                                        }

                                        if (typeof stateInfo.timeout === 'number') {
                                            timeout = setTimeout(() => {
                                                player.removeEventListener('onStateChange', onPlayerStateChange)

                                                resolve()
                                            }, stateInfo.timeout)
                                        }

                                        if (
                                            Array.isArray(stateInfo.acceptableStates) &&
                                            stateInfo.acceptableStates.indexOf(playerStateAfterChange) !== -1
                                        ) {
                                            player.removeEventListener('onStateChange', onPlayerStateChange)
                                            if (timeout) {
                                                clearTimeout(timeout)
                                            }

                                            resolve()
                                        }
                                    }

                                    player.addEventListener('onStateChange', onPlayerStateChange)
                                })
                                    .then(() => {
                                        return value
                                    })
                            }

                            return value
                        })
                }
            } else {
                //@ts-ignore
                functions[functionName] = (...args: any[]) => {
                    return playerAPIReady
                        .then((player) => {
                            // eslint-disable-next-line no-warning-comments
                            // TODO: Just spread the args into the function once Babel is fixed:
                            // https://github.com/babel/babel/issues/4270
                            //
                            if (player[functionName as 'addEventListener'] === undefined) {
                                return
                            }
                            // eslint-disable-next-line prefer-spread
                            return player[functionName as 'addEventListener'].apply(player, args as any)
                        })
                }
            }


        }

        const UNPROMISE_METHODS = ['mute', 'isMuted', 'getVolume', 'getVideoUrl', 'getCurrentTime', 'getDuration', 'getPlaylistIndex', 'getPlaylist', 'getPlayerState'] as const
        const player = await playerAPIReady
        for (let method of UNPROMISE_METHODS) {
            //@ts-ignore
            functions[method] = (...args: any[]) => player[method].apply(player, args)
        }
        return functions
    },
}


// interface YouTubePlayerI {
//     proxyEvents: (emitter: EmitterType) => EventHandlerMapType
//     promisifyPlayer: (playerAPIReady: Promise<YouTubePlayerType>, strictState?: boolean) => YouTubePlayerType
// };

export default YouTubePlayer