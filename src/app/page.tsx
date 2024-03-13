import Link from "next/link";

export default function Home() {
    return (
        <div>
            <p>This is the home page</p>
            <Link href="/profile">This goes over to profile</Link>
        </div>
    );
}
