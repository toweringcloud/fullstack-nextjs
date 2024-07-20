import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import { EyeIcon, UserIcon } from "@heroicons/react/24/solid";

import AddComment from "@/components/add-comment";
import Button from "@/components/button";
import LikeButton from "@/components/button-like";
import { formatToTimeAgo } from "@/libs/utils";

import {
	getUser,
	getTweet,
	getLikeStatus,
	getCommentCount,
	getComments,
	addComment,
} from "./actions";

const getCachedTweet = nextCache(getTweet, ["tweet-detail"], {
	tags: ["tweet-detail"],
	revalidate: 60,
});

function getCachedLikeStatus(tweetId: number) {
	const cachedOperation = nextCache(getLikeStatus, ["tweet-like-status"], {
		tags: [`like-status-${tweetId}`],
	});
	return cachedOperation(tweetId);
}

export default async function Detail({ params }) {
	const user = await getUser();
	console.log("# user : " + user!.username);

	const id = Number(params.id);
	if (isNaN(id)) {
		return notFound();
	}

	// const item = await getTweet(id);
	const item: any = await getCachedTweet(id);
	if (!item) {
		return notFound();
	}

	const { likeCount, isLiked } = await getLikeStatus(id);
	// const { likeCount, isLiked } = await getCachedLikeStatus(id);
	// ⨯ Error: Route /tweets/6 used "cookies" inside a function cached with "unstable_cache(...)". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use "cookies" outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache

	const commentCount = await getCommentCount();
	console.log("# comments : " + commentCount);

	let currentPage = 0;
	const pageCount = commentCount / 5 + 1;
	const comments = await getComments(5, currentPage);

	return (
		<div className="flex flex-col gap-10 py-8 px-6">
			<div className="text-3xl text-center pt-[5vh]">✨ Detail ✨</div>
			<Link href="/">
				<Button mode="primary" text="Go to Home" />
			</Link>
			<h2>Tweet Info ({item?.id})</h2>
			<hr className="-mt-9 -mb-5" />
			<div className="flex flex-col gap-2 text-gray-400">
				<span className="mb-2">{item?.payload}</span>
				<div className="flex justify-between items-start *:flex *:gap-2 -mb-4">
					<span className="text-pretty">
						<UserIcon className="size-5" />
						{item?.user.username}
					</span>
					<span>{formatToTimeAgo(item?.created_at.toString())}</span>
				</div>
			</div>
			<hr className="-mt-5 -mb-8" />
			<div className="flex justify-between items-start">
				<div className="flex items-center gap-2 text-neutral-400 text-sm">
					<EyeIcon className="size-5" />
					<span>조회 {item.views}</span>
				</div>
				<LikeButton
					isLiked={isLiked}
					likeCount={likeCount}
					tweetId={id}
				/>
			</div>
			<AddComment action={addComment} tweetId={item?.id} />
			<h2>Latest 3 Comments</h2>
			<hr className="-mt-9 -mb-5" />
			<div className="flex flex-col gap-3">
				{comments.map((item) => (
					<div key={item.id}>
						<div className="text-xs border rounded-md p-3 bg-gray-800 hover:bg-gray-700 flex justify-between items-center">
							<div className="flex gap-2 w-[80%]">
								{item.payload}
							</div>
							<div className="text-gray-400">
								{item.created_at.toLocaleTimeString()}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
