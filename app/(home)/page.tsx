import Link from "next/link";
import { UserIcon } from "@heroicons/react/24/outline";

import AddTweet from "@/components/add-tweet";
import Button from "@/components/button";

import {
	getUser,
	getTweetCount,
	getTweets,
	addTweet,
	viewProfile,
} from "./actions";

export default async function Home() {
	const user = await getUser();
	console.log("# user : " + user!.username);

	const tweetCount = await getTweetCount();
	console.log("# tweets : " + tweetCount);

	let currentPage = 0;
	const pageCount = tweetCount / 5 + 1;
	const tweets = await getTweets(5, currentPage);

	return (
		<div className="flex flex-col gap-10 py-8 px-6">
			<div className="text-3xl text-center pt-[10vh]">✨ Home ✨</div>
			<form action={viewProfile}>
				<Button mode="secondary" text="Go to Profile" />
			</form>
			<AddTweet action={addTweet} />
			<h2>All Tweets</h2>
			<hr className="-mt-10 -mb-5" />
			<div className="flex flex-col gap-2">
				{tweets.map((item) => (
					<Link key={item.id} href={`/tweets/${item.id}`}>
						<div className="border rounded-md p-3 bg-gray-800 flex justify-between">
							<div className="flex flex-row gap-2">
								<UserIcon className="size-8" />
								{item.tweet}
							</div>
							<span className="text-gray-400">
								{item.created_at.toLocaleTimeString()}
							</span>
						</div>
					</Link>
				))}
			</div>
			<div className="flex justify-around">
				<Link href="/">PREV</Link>
				<Link href="/">NEXT</Link>
			</div>
		</div>
	);
}
