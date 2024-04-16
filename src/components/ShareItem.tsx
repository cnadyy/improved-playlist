import { css } from "@emotion/react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";

export default function ShareItem({
    showModal,
    closeModal,
}: {
    showModal: boolean;
    closeModal: () => void;
}) {
    const ref = useRef<HTMLDialogElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (showModal) ref.current?.showModal();
        else ref.current?.close();
        if (window) {
            console.log();
        }
    }, [showModal]);

    return (
        <dialog ref={ref} onCancel={closeModal}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                Share!
                <div
                    style={{
                        fontSize: "1.4rem",
                        padding: "2px 10px",
                    }}
                    onClick={closeModal}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </div>
            </div>
            <div
                style={{
                    flexDirection: "row",
                    marginTop: "1rem",
                }}
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={window.location.href}
                    readOnly={true}
                    style={{
                        width: "45vw",
                    }}
                />
                <button
                    css={css`
                        background-color: gray;
                        border: none;
                        color: white;
                        margin-left: 0.5rem;
                        padding: 5px 10px;
                        &:hover {
                            background-color: darkgray;
                        }
                    `}
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                    }}
                >
                    Copy
                </button>
            </div>
        </dialog>
    );
}
