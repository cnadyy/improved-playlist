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

interface openedFolder {
    open: boolean;
    openedBefore: boolean;
}

export function useIsOpen(): [typeof open, typeof toggleOpen] {
    const [open, setOpen] = useState<openedFolder>({
        open: false,
        openedBefore: false,
    });

    const toggleOpen = () => {
        if (open.openedBefore)
            setOpen({ open: !open.open, openedBefore: true });
        else setOpen({ open: true, openedBefore: true });
    };

    return [open, toggleOpen];
}
