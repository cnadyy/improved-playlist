"use client";

import FolderComponent from "@/components/FolderComponent";
import Folder from "@/api/types/Folder";
import { CSSProperties, useEffect, useState } from "react";
import NewFolder from "@/components/NewFolderComponent";
import Link from "next/link";
import Header from "@/components/Header";
import filterFolder from "@/api/search-functions/filterFolders";
import getUserFolders from "@/api/firebase/get/userFolders";
import useUser from "@/api/firebase/get/user";
import { Auth } from "@/api/firebase/createApp";
import Loading from "@/components/Loading";
import usePinnedUserFolders from "@/api/hooks/usePinnedUserFolders";

const folderListStyle: CSSProperties = {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    padding: "0",
    margin: "0",
};

export default function Folders() {
    const folders = usePinnedUserFolders();
    const [searchEntry, setSearchEntry] = useState<string>("");
    const user = useUser(Auth.currentUser!.uid);

    if (!user) {
        return <Loading />;
    }

    const filteredFolders = folders.filter((f) =>
        filterFolder(f, searchEntry, user.pinned),
    );

    return (
        <>
            <Header
                searchEntry={searchEntry}
                setSearchEntry={setSearchEntry}
                styling={{ backgroundColor: "white" }}
            >
                <NewFolder />
            </Header>
            <div style={{ padding: "0 2rem" }}>
                {filteredFolders.length ? (
                    <ul style={folderListStyle}>
                        {filteredFolders.map((folder) => (
                            <li key={folder.id} style={{ listStyle: "none" }}>
                                <Link
                                    href={"/playback-test?id=" + folder.id}
                                    style={{ all: "unset" }}
                                >
                                    <FolderComponent data={folder} />
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <h1
                        style={{
                            backgroundImage: "linear-gradient(indigo, green)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        No folders found! Try creating the folder you seek
                    </h1>
                )}
            </div>
        </>
    );
}
