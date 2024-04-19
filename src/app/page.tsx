"use client";

import Link from "next/link";
// include file in build
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import bg from "@/../public/niklas-tidbury-groundhog.jpg";

export default function Home() {
    return (
        <>
            <main
                style={{
                    height: "100vh",
                    width: "100%",
                    backgroundImage: `url(niklas-tidbury-groundhog.jpg)`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    overflow: "hidden",
                }}
            >
                <p>Improved spotify playlists</p>
                <p>One day this might look pretty</p>
                <Link href="/home">This goes over to the site!</Link>
            </main>
            <footer>
                <p>
                    Photo by{" "}
                    <a href="https://unsplash.com/@ntidbury?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
                        Niklas Tidbury
                    </a>{" "}
                    on{" "}
                    <a href="https://unsplash.com/photos/brown-beaver-V7ZLzhBbY0o?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
                        Unsplash
                    </a>
                </p>
            </footer>
        </>
    );
}
