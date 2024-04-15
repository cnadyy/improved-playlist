export default function Loading() {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                height: "100vh",
            }}
        >
            <div style={{ fontWeight: 900, fontSize: 50 }}>
                Improved Spotify Playlists
            </div>{" "}
            <div style={{ marginTop: 20, fontSize: 30 }}>Loading...</div>
        </div>
    );
}
