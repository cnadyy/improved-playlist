export default function CurrentlyPlayingComponent() {
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <div
                style={{
                    width: "3rem",
                    height: "3rem",
                    backgroundColor: "red",
                }}
            ></div>
            <div
                style={{
                    marginLeft: "0.5rem",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div>Current playing</div>
                <div style={{ color: "gray", fontSize: "0.8rem" }}>
                    No author
                </div>
            </div>
        </div>
    );
}
