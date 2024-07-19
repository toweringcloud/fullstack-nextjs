import Link from "next/link";
import { EyeIcon } from "@heroicons/react/24/solid";
import {
	ChatBubbleBottomCenterIcon,
	HandThumbUpIcon,
} from "@heroicons/react/24/outline";

import AddTweet from "@/components/add-tweet";
import Button from "@/components/button";

import { getUser, getTweetCount, getTweets, addTweet } from "./actions";

export default async function Home() {
	const user = await getUser();
	console.log("# users : " + user!.username);

	const tweetCount = await getTweetCount();
	console.log("# tweets : " + tweetCount);

	let currentPage = 0;
	const pageCount = tweetCount / 5 + 1;
	const tweets = await getTweets(5, currentPage);

	return (
		<div className="flex flex-col gap-10 py-8 px-6">
			<div className="text-3xl text-center pt-[5vh]">✨ Home ✨</div>
			<Link href="/profile">
				<Button mode="primary" text="Go to Profile" />
			</Link>
			<AddTweet action={addTweet} />
			<h2>Latest 5 Tweets</h2>
			<hr className="-mt-9 -mb-5" />
			<div className="flex flex-col gap-3">
				{tweets.map((item) => (
					<div key={item.id}>
						<Link href={`/tweets/${item.id}`}>
							<div className="text-xs border rounded-md p-3 bg-gray-800 hover:bg-gray-700 flex justify-between items-center">
								<div className="flex gap-2 w-[80%]">
									{item.payload}
								</div>
								<div className="text-gray-400">
									{item.created_at.toLocaleTimeString()}
								</div>
							</div>
						</Link>
						<div className="text-xs text-gray-300 flex gap-4 items-center *:flex *:gap-1 *:items-center">
							<span>
								<EyeIcon className="size-5" />
								{item.views}
							</span>
							<span>
								<HandThumbUpIcon className="size-4" />
								{item._count.likes}
							</span>
							<span>
								<ChatBubbleBottomCenterIcon className="size-4" />
								{item._count.comments}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
