export type PositionId = string;

export interface ListState {
    openedFolders: PositionId[];
    disabledItems: PositionId[];
}

export type Action =
    | { type: "TOGGLE_OPEN"; id: PositionId }
    | { type: "TOGGLE_ENABLED"; id: PositionId };

export type contextType = [ListState, React.Dispatch<Action>];
