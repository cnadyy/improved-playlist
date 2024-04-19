import { Subitem } from "@/api/types/Folder";
import { useCallback, useEffect, useRef } from "react";

/**
 * To be used in conjunction with usePlayer at the root and useChildPlayer on children
 */
class Player {
    startEvent: PlayEvent;
    private startPlayback: (onChildOver: resolvePlayback) => void;

    constructor() {
        console.log("the constructor")
        const rootPromise = Promise.withResolvers();
        this.startPlayback = rootPromise.resolve;
        this.startEvent = rootPromise.promise as PlayEvent;
    }

    start() {
        console.log("maybe its start")
        this.startPlayback(this._onChildrenFinished);
    }

    _onChildrenFinished() {
        console.log("All children have resolved");
    }
}

/**
 * Used only at the root of playback to control the root promise
 * @returns mutable player ref that persists for lifetime of component
 */
export function usePlayer(): typeof player {
    console.log("new player")
    const player = useRef(new Player()).current;

    return player;
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
    const playableItems = useRef(
        items.map((child) => {
            console.log("we")
            const event = Promise.withResolvers();
            return {
                playEvent: event.promise as PlayEvent,
                triggerEvent: event.resolve,
                ...child,
            };
        }),
    ).current;

    // starts as -1 as each iteration increments by 1
    let playingIndex = useRef(-1).current;

    // recursively called to dig down the playback tree
    const playNext = useCallback((): Promise<void> => {
        console.log("next")
        return new Promise((resolve) => {
            playingIndex++;
            try {
                playableItems[playingIndex].triggerEvent(() => {
                    console.log(
                        `child of id ${playableItems[playingIndex]} finished playback`,
                    );
                    playNext().then(() => resolve());
                });
            } catch (e) {
                console.log("resolving children. here is status:")
                console.log(items)
                resolve();
            }
        });
    }, []);

    // mount only a single .then event to tell the parent that its children have finished playing
    useEffect(() => {
        console.log("effect")
        playEvent.then((resolveComponentPlaying): void => {
            console.log("a series of children has been invoked")
            playNext();
        });
    }, []);

    // itemIDs and types to typically be rendered in ItemList
    return playableItems;
}
