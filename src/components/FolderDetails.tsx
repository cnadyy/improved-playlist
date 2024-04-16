import Folder from "@/api/types/Folder";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
    faAdd,
    faPlayCircle,
    faShare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSSProperties, useContext, useState } from "react";
import { FolderExplorerContext } from "./explorer/FolderContext";
import AddItem from "./newItems/AddItem";
import ShareItem from "./ShareItem";
import getUser from "@/api/firebase/get/user";
import useUser from "@/api/firebase/get/user";
import { Auth } from "@/api/firebase/createApp";

const folderIconStyle: CSSProperties = {
    minWidth: "13rem",
    minHeight: "13rem",
    filter: "saturate(0.4)",
    transition: "0.5s",
};

const button = css`
    margin-right: 20px;
    transition: color 0.15s ease;
    &:hover {
        color: #666666;
    }
`;

const FolderName = styled.h1`
    font-weight: 600;
    margin: 0rem;
    font-size: 4rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow-wrap: anywhere;
    overflow: hidden;
    &::after {
        content: "${(props) => props.content}";
        background-color: white;
        position: absolute;
        left: 0;
        top: 0;
        visibility: hidden;
        pointer-events: none;
    }
    &:hover::after {
        visibility: visible;
    }
`;

export default function FolderDetailsComponent({
    folder,
    folders,
}: {
    folder: Folder;
    folders: Folder[];
}) {
    const { disabledFolders } = useContext(FolderExplorerContext);
    // const [folders, setFolders] = useFolderList();

    const [editModal, setEditModal] = useState<boolean>(false);
    const [shareModal, setShareModal] = useState<boolean>(false);

    const owner = useUser(folder.owner);

    return (
        <div
            css={css`
                display: flex;
                justify-content: flex-start;
                align-items: center;
            `}
        >
            <div
                className={"folderIcon"}
                style={{ backgroundColor: folder.color, ...folderIconStyle }}
            />
            <div
                css={css`
                    padding: 0 1rem;
                `}
            >
                <div style={{ position: "relative" }}>
                    <FolderName content={folder.name}>{folder.name}</FolderName>
                </div>
                <div>Owned by {owner ? owner.name : "Ummm"}</div>
                {/**
          <h3
          css={css`
            padding: 0.25rem;
            color: gray;
            font-weight: normal;
            `}
            >
            This is a cool folder description :)
            </h3>
        **/}
                <div
                    css={css`
                        margin-left: 0.5rem;
                        margin-top: 1rem;
                        margin-bottom: 1rem;
                    `}
                >
                    <FontAwesomeIcon
                        css={button}
                        icon={faPlayCircle}
                        size="2xl"
                        onClick={() => console.error("todo...")}
                    />
                    {folder.owner == Auth.currentUser!.uid && (
                        <FontAwesomeIcon
                            onClick={() => setEditModal(true)}
                            css={button}
                            icon={faAdd}
                            size="2xl"
                        />
                    )}
                    {folder.public && (
                        <FontAwesomeIcon
                            onClick={() => setShareModal(true)}
                            css={button}
                            icon={faShare}
                            size="2xl"
                        />
                    )}
                </div>
            </div>
            {editModal ? (
                <AddItem
                    showModal={editModal}
                    closeModal={() => setEditModal(false)}
                    folderID={folder.id}
                />
            ) : null}
            {shareModal && folder.public && (
                <ShareItem
                    showModal={shareModal}
                    closeModal={() => setShareModal(false)}
                />
            )}
        </div>
    );
}
