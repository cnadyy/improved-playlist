import { PositionId } from "@/api/types/itemsReducer";
import { listContext } from "@/app/playback-test/ListStateContext";
import { useContext, useState } from "react";

export function useIsDisabled(
    id: PositionId,
): [typeof isDisabled, typeof toggleDisabled] {
    const [listState, dispatch] = useContext(listContext);

    const isDisabled = listState.disabledItems.find((dId) => dId == id);

    const toggleDisabled = () => {
        dispatch({ type: "TOGGLE_ENABLED", id: id });
    };

    return [isDisabled, toggleDisabled];
}

export function useIsOpen(id: PositionId): [typeof isOpen, typeof toggleOpen] {
    const [listState, dispatch] = useContext(listContext);

    const isOpen = Boolean(listState.openedFolders.find((oId) => oId == id));

    const toggleOpen = () => dispatch({ type: "TOGGLE_OPEN", id: id });

    return [isOpen, toggleOpen];
}
