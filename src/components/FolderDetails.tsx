import Folder from "@/api/types/Folder";
import { css } from "@emotion/react";
import { faPencil, faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSSProperties } from "react";

const folderIconStyle: CSSProperties = {
  width: "13rem",
  height: "13rem",
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

export default function FolderDetailsComponent({ folder }: { folder: Folder }) {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
      `}
    >
      <div
        className={"folderIcon"}
        style={{ backgroundColor: folder.color, ...folderIconStyle }}
      />
      <div
        css={css`
          padding: 1rem;
        `}
      >
        <h1
          css={css`
            font-weight: 600;
          `}
        >
          {folder.name}
        </h1>
        <h3
          css={css`
            padding: 0.25rem;
            color: gray;
            font-weight: normal;
          `}
        >
          This is a cool folder description :)
        </h3>
        <div
          css={css`
            margin-left: 0.5rem;
            margin-top: 1rem;
            margin-bottom: 1rem;
          `}
        >
          <FontAwesomeIcon css={button} icon={faPlayCircle} size="2xl" />
          <FontAwesomeIcon css={button} icon={faPencil} size="2xl" />
        </div>
      </div>
    </div>
  );
}
