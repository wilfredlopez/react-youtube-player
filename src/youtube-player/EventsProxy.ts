
interface Listener {
    name: string, handler: Function
}

// let Instance: EventsProxy | null = null

export default class EventsProxy {
    events: Record<any, Listener[]> = {}

    /**
     * @name handler
     * @function
     * @param {Object} data Event data.
     */

    on(name: string, handler: (...args: any) => void) {
        const listener = { name: name, handler: handler }
        this.events[name] = this.events[name] ?? []
        this.events[name].unshift(listener)
        return listener
    }

    off(listener: Listener) {
        let index = this.events[listener.name].indexOf(listener)

        if (index !== -1) {
            this.events[listener.name].splice(index, 1)
        }
    }
    trigger(name: string, data: any) {
        let listeners = this.events[name],
            i

        if (listeners) {
            i = listeners.length
            while (i--) {
                listeners[i].handler(data)
            }
        }
    }
}



