import Link from "next/link";
import { EyeIcon } from "@heroicons/react/24/solid";
import {
	ChatBubbleBottomCenterIcon,
	HandThumbUpIcon,
	PencilSquareIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";

import Button from "@/components/button";
import TweetAdd from "@/components/tweet-add";

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
		<div className="h-screen flex justify-center items-center">
			<div className="flex flex-col gap-10 py-8 px-6 mx-[15%] min-w-[450px]">
				<div className="text-3xl text-center">✨ Home ✨</div>
				<Link href="/profile">
					<Button mode="primary" text="Go to Profile" />
				</Link>
				<TweetAdd action={addTweet} />
				<div className="flex justify-between gap-5">
					<h2>Latest 5 Tweets</h2>
					<span className="text-gray-400">Total {tweetCount}</span>
				</div>
				<hr className="-mt-9 -mb-5" />
				<div className="flex flex-col gap-3">
					{tweets.map((item) => (
						<div key={item.id}>
							<Link href={`/tweets/${item.id}`}>
								<div className="text-xs border rounded-md p-3 bg-gray-800 hover:bg-gray-700 flex justify-between items-center">
									<div className="flex w-[80%]">
										{item.payload}
									</div>
									<div className="text-gray-400 pl-1">
										{item.created_at.toLocaleTimeString()}
									</div>
								</div>
							</Link>
							<div className="text-xs text-gray-300 mt-1 flex justify-between">
								<div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
									<span>
										<EyeIcon className="size-4" />
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
								<div className="flex gap-1 items-center *:flex *:gap-1 *:items-center">
									<PencilSquareIcon className="size-4 text-teal-500" />
									<TrashIcon className="size-4 text-orange-500 " />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
