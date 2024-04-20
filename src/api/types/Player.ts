/* eslint @typescript-eslint/no-unused-vars: 0 */
type resolvePlayback = () => void;

type PlayEvent = Promise<resolvePlayback>;

interface HasPlayEvent {
    playEvent: PlayEvent;
    triggerEvent: (arg0: unknown) => void;
}
