import Folder from "@/api/types/Folder";
import FolderExplorerComponent, {
    Grid,
} from "@/components/explorer/FolderExplorerItem";
import { useContext, useState } from "react";

import {
    FolderExplorerContext,
    foldersIncludes,
} from "@/components/explorer/FolderContext";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    rectIntersection,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
    restrictToVerticalAxis,
    restrictToParentElement,
} from "@dnd-kit/modifiers";
import FolderExplorerLabel from "@/components/explorer/FolderExplorerLabel";
import { getIcon, updateFolders } from "@/components/explorer/FolderUtils";

// This only renders subitems,
// it is not responseible for rendering the original folder.
function FolderExporer({
    folders,
    rootId,
}: {
    folders: Folder[];
    rootId: string;
}) {
    return (
        <DrawFolderList
            folders={folders}
            folderID={rootId}
            isParentDisabled={false}
            trail={[]}
        />
    );
}

function DrawFolderList({
    folders,
    folderID,
    isParentDisabled,
    trail,
}: {
    folders: Folder[];
    folderID: string;
    isParentDisabled: boolean;
    trail: number[];
}) {
    const folderContext = useContext(FolderExplorerContext);
    const { disabledFolders, openedFolders, trails } = folderContext;

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 1 } }),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const [active, setActive] = useState<{
        id: number;
        opened: boolean;
        disabled: boolean;
    } | null>(null);

    const folder = folders.find((f) => f.id == folderID);
    if (!folder) {
        return <>Invalid Folder?</>;
    }

    function handleStart(event: DragStartEvent) {
        const currentTrail = trails[Number(event.active.id)].trail;
        setActive({
            id: Number(event.active.id),
            opened: foldersIncludes(openedFolders, currentTrail),
            disabled: foldersIncludes(disabledFolders, currentTrail),
        });
    }

    function handleEnd(event: DragEndEvent) {
        setActive(null);

        if (event.over && folder) {
            const activeTrail = trails[Number(event.active.id)].trail;
            const from = activeTrail[activeTrail.length - 1];

            const overTrail = trails[Number(event.over.id)].trail;
            const to = overTrail[overTrail.length - 1];

            updateFolders(folderContext, folder, from, to);
        }
    }

    const itemKeys = folder.items.map((value, index) => {
        const item = value;
        const itemTrail = [...trail];
        if (index != undefined) {
            itemTrail.push(index);
        }

        let key = trails.findIndex(
            (a) => a.trail.toString() == itemTrail.toString(),
        );
        if (key == -1) {
            key = trails.length;
            trails.push({ item: item, trail: itemTrail });
        } else if (trails[key].item != item) {
            trails.map((old, i) => (i == key ? { ...old, item } : old));
        }
        if (key == 0) {
            return "0";
        }
        return key;
    });

    return (
        <>
            <DndContext
                sensors={sensors}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                collisionDetection={rectIntersection}
                onDragEnd={handleEnd}
                onDragStart={handleStart}
            >
                <SortableContext
                    strategy={verticalListSortingStrategy}
                    items={itemKeys}
                >
                    <div style={{ display: "grid" }}>
                        {folder.items.map((value, index) => {
                            const item = value;
                            const itemTrail = [...trail];
                            if (index != undefined) {
                                itemTrail.push(index);
                            }

                            const key = itemKeys[index];

                            {
                                /*key*/
                            }
                            return (
                                <FolderExplorerComponent
                                    folders={folders}
                                    isParentDisabled={isParentDisabled}
                                    trail={itemTrail}
                                    item={item}
                                    id={key}
                                    key={key}
                                />
                            );
                        })}
                    </div>
                </SortableContext>
                <DragOverlay>
                    {active != null ? (
                        <Grid depth={trail.length + 1}>
                            <FolderExplorerLabel
                                item={trails[active.id].item}
                                icon={getIcon(
                                    trails[active.id].item.kind,
                                    active.opened,
                                )}
                                strikethrough={
                                    isParentDisabled || active.disabled
                                }
                                isDisabled={active.disabled}
                                isRootNode={trail.length + 1 == 1}
                            />
                        </Grid>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </>
    );
}

export { FolderExporer as default, DrawFolderList };
