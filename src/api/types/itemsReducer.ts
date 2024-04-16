export type PositionId = string;

export interface ListState {
    disabledItems: PositionId[];
}

export type Action = { type: "TOGGLE_ENABLED"; id: PositionId };

export type contextType = [ListState, React.Dispatch<Action>];
