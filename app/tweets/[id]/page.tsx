import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import { EyeIcon, UserIcon } from "@heroicons/react/24/solid";

import Button from "@/components/button";
import CommentAdd from "@/components/comment-add";
import CommentRemove from "@/components/comment-remove";
import LikeButton from "@/components/button-like";
import { formatToTimeAgo } from "@/libs/utils";

import {
	getUser,
	getTweet,
	getLikeStatus,
	getCommentCount,
	getComments,
	addComment,
	removeComment,
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

	// const tweet = await getTweet(id);
	const tweet: any = await getCachedTweet(id);
	if (!tweet) {
		return notFound();
	}

	const { likeCount, isLiked } = await getLikeStatus(id);
	// const { likeCount, isLiked } = await getCachedLikeStatus(id);
	// ⨯ Error: Route /tweets/6 used "cookies" inside a function cached with "unstable_cache(...)". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use "cookies" outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache

	const commentCount = await getCommentCount(id);
	console.log("# comments : " + commentCount);

	let currentPage = 0;
	const pageCount = commentCount / 3 + 1;
	const comments = await getComments(3, currentPage, id);

	return (
		<div className="flex flex-col gap-10 py-8 px-6">
			<div className="text-3xl text-center pt-[5vh]">✨ Detail ✨</div>
			<Link href="/">
				<Button mode="primary" text="Go to Home" />
			</Link>
			<h2>Tweet Info ({tweet?.id})</h2>
			<hr className="-mt-9 -mb-5" />
			<div className="flex flex-col gap-2 text-gray-400">
				<span className="mb-2">{tweet?.payload}</span>
				<div className="flex justify-between items-start *:flex *:gap-2 -mb-4">
					<span className="text-pretty">
						<UserIcon className="size-5" />
						{tweet?.user.username}
					</span>
					<span>{formatToTimeAgo(tweet?.created_at.toString())}</span>
				</div>
			</div>
			<hr className="-mt-5 -mb-8" />
			<div className="flex justify-between items-start">
				<div className="flex items-center gap-2 text-neutral-400 text-sm">
					<EyeIcon className="size-5" />
					<span>View {tweet.views}</span>
				</div>
				<LikeButton
					isLiked={isLiked}
					likeCount={likeCount}
					tweetId={id}
				/>
			</div>
			<CommentAdd action={addComment} tweetId={tweet?.id} />
			<div className="flex justify-between gap-5">
				<h2>Latest 3 Comments</h2>
				<span className="text-gray-400">Total {commentCount}</span>
			</div>
			<hr className="-mt-9 -mb-5" />
			<div className="flex flex-col gap-3">
				{comments.map((comment) => (
					<div key={comment.id}>
						<div className="text-xs border rounded-md p-3 bg-gray-800 hover:bg-gray-700 flex justify-between items-center">
							<div className="flex gap-2 w-[75%]">
								{comment.payload}
							</div>
							<div className=" text-gray-400 pl-1">
								{comment.created_at.toLocaleTimeString()}
							</div>
							<div className="flex items-center">
								<CommentRemove
									action={removeComment}
									tweetId={tweet?.id}
									commentId={comment.id}
								/>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
