import Link from "next/link";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-between min-h-screen p-6">
			<div className="my-auto flex flex-col items-center gap-2 *:font-medium">
				<span className="text-9xl">✨</span>
				<h1 className="text-2xl">Authentication Challenge</h1>
				<h2 className="text-4xl ">
					{" "}
					<Link href="/login" className="hover:underline">
						Log in
					</Link>
				</h2>
				<hr />
				<Link href="/create-account" className="hover:underline">
					or Join
				</Link>
			</div>
		</div>
	);
}
