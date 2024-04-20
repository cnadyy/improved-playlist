import { Subitem } from "@/api/types/Folder";
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

type playEventSetter = Dispatch<SetStateAction<PlayEvent>>;

/**
 * To be used in conjunction with usePlayer at the root and useChildPlayer on children
 */
class Player {
    startEvent: PlayEvent;
    private startPlayback: (onChildOver: resolvePlayback) => void;
    setEvent?: playEventSetter;

    constructor() {
        const rootPromise = Promise.withResolvers();
        this.startPlayback = rootPromise.resolve;
        this.startEvent = rootPromise.promise as PlayEvent;
    }

    start() {
        // yes, that bind is required.
        this.startPlayback(this._onChildrenFinished.bind(this));
    }

    _initPromise() {
        const rootPromise = Promise.withResolvers();
        this.startPlayback = rootPromise.resolve;
        this.startEvent = rootPromise.promise as PlayEvent;
        if (this.setEvent) this.setEvent(this.startEvent);
    }

    _onChildrenFinished() {
        console.log("All children have resolved");
        // reset promise state
        this._initPromise();
    }
}

/**
 * Used only at the root of playback to control the root promise
 * @returns mutable player ref that persists for lifetime of component
 * @returns root playEvent as state
 */
export function usePlayer(): [typeof player, PlayEvent] {
    const player = useRef(new Player()).current;
    const [playEvent, setEvent] = useState<PlayEvent>(player.startEvent);
    if (typeof player.setEvent == "undefined") player.setEvent = setEvent;

    return [player, playEvent];
}

function generateEvents(items: Subitem[]): (Subitem & HasPlayEvent)[] {
    return items.map((child) => {
        const event = Promise.withResolvers();
        return {
            playEvent: event.promise as PlayEvent,
            triggerEvent: event.resolve,
            ...child,
        };
    });
}

/**
 * @info internally controls flow of playback across items
 * @returns a converted folder item list to playable items complete with promises to control playback flow
 */
export function useChildPlayer(
    items: Subitem[],
    playEvent: PlayEvent,
): (Subitem & HasPlayEvent)[] {
    // maintain the same promise references across the life of the component
    // also rendering children depends on this ref so you cant ever mutate it.
    // quite a mistake FIXME.
    const playableItems = useRef(generateEvents(items));

    // starts as -1 as each iteration increments by 1
    const playingIndex = useRef(-1);
    const playEventAttached = useRef(false);

    // recursively called to dig down the playback tree
    const playNext = useCallback((): Promise<void> => {
        return new Promise((itemFinished) => {
            playingIndex.current++;
            try {
                const item = playableItems.current[playingIndex.current];
                item.triggerEvent(() => {
                    console.log(`child of id ${item.itemID} finished playback`);
                    playNext().then(() => itemFinished());
                });
            } catch (e) {
                itemFinished();
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // mount only a single .then event to tell the parent that its children have finished playing
    useEffect(() => {
        if (!playEventAttached.current) {
            playEventAttached.current = true;
            playEvent.then((resolveComponentPlaying): void => {
                playNext().then(() => resolveComponentPlaying());
            });
        }
    }, [playEvent, playNext]);

    // itemIDs and types to typically be rendered in ItemList
    return playableItems.current;
}
