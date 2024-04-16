import { Action, ListState, contextType } from "@/api/types/itemsReducer";
import React, { createContext, useReducer } from "react";

function handleItemChange(state: ListState, action: Action): ListState {
    switch (action.type) {
        case "TOGGLE_ENABLED":
            if (state.disabledItems.find((id) => id == action.id))
                return {
                    ...state,
                    disabledItems: state.disabledItems.filter(
                        (id) => action.id != id,
                    ),
                };
            else
                return {
                    ...state,
                    disabledItems: state.disabledItems.concat(action.id),
                };
    }
}

export const listContext = createContext<contextType>({} as contextType);

export default function ListStateContext({
    children,
}: {
    children: React.ReactNode;
}): React.ReactNode {
    const listState = useReducer(handleItemChange, {
        disabledItems: [],
    });

    return (
        <listContext.Provider value={listState}>
            {children}
        </listContext.Provider>
    );
}
