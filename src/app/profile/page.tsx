"use client";

import { useEffect, useState } from "react";
import getUserData from "@api/getUserData";
import { useSearchParams } from "next/navigation";
import queueTrack from "@api/queueTrack";
import UserPlaylists from "@/components/UserPlaylists";

function getDisplayName(setDisplayName: Function) {
	getUserData().then((res) => setDisplayName(res.display_name));
}

export default function Profile() {
	const [displayName, setDisplayName] = useState("loading...");

	useEffect(() => {
		getDisplayName(setDisplayName);
	}, []);

	function playTrack() {
		queueTrack(encodeURIComponent("spotify:track:7irQdnDBovK2AVSBilasDZ")).then(r =>
			// FIXME: Handle error
			r
		);
	}

	return (
		<>
			<a>{displayName}</a>
			<UserPlaylists onAdd={playlist => console.log(playlist)} />
			<a style={{ color: "blue" }} onClick={playTrack}>
				{" "}
				play the celesete
			</a>
		</>
	);
}
