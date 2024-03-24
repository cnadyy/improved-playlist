import { useFolderList } from "@/api/getFolderList";
import Folder from "@/api/types/Folder";
import playFolder from "@/app/utils/Player";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { faPencil, faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { relative } from "path";
import { CSSProperties } from "react";

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
  overflow: hidden;
  &::after {
    content: "${props => props.content}";
    background-color: white;
    position: absolute;
    left: 0;
    top: 0;
    visibility: hidden;
  },
  &:hover::after {
    visibility: visible;
  }
`;

export default function FolderDetailsComponent({
  folder,
  disabledFolders,
}: {
  folder: Folder;
  disabledFolders: Set<string>;
}) {
  const router = useRouter();
  const folders = useFolderList();
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
        <div style={{position: "relative"}}><FolderName content={folder.name}>{folder.name}</FolderName></div>
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
            onClick={() => playFolder(folder.id, folders, disabledFolders)}
          />
          <FontAwesomeIcon
            onClick={() => router.push("/edit?" + folder.id)}
            css={button}
            icon={faPencil}
            size="2xl"
          />
        </div>
      </div>
    </div>
  );
}
