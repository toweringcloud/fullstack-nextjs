import { notFound, redirect } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import { EyeIcon, UserIcon } from "@heroicons/react/24/solid";

import Button from "@/components/button";
import LikeButton from "@/components/button-like";
import { db } from "@/libs/db";
import getSession from "@/libs/session";
import { formatToTimeAgo } from "@/libs/utils";

async function getUser() {
	const session = await getSession();
	if (session.id) {
		const user = await db.user.findUnique({
			where: {
				id: session.id,
			},
		});
		if (user) {
			return user;
		}
	}
	redirect("/login");
}

async function getTweet(id) {
	try {
		const tweet = await db.tweet.update({
			where: {
				id: parseInt(id),
			},
			data: {
				views: {
					increment: 1,
				},
			},
			include: {
				user: {
					select: {
						username: true,
					},
				},
				_count: {
					select: {
						comments: true,
						likes: true,
					},
				},
			},
		});
		return tweet;
	} catch (e) {
		return null;
	}
}

const getCachedTweet = nextCache(getTweet, ["tweet-detail"], {
	tags: ["tweet-detail"],
	revalidate: 60,
});

async function getIsLiked(tweetId: number) {
	const session = await getSession();
	const like = await db.like.findUnique({
		where: {
			cid: {
				tweetId,
				userId: session.id!,
			},
		},
	});
	return like == null ? false : true;
}

async function getLikeStatus(tweetId: number) {
	const isLiked = await getIsLiked(tweetId);
	const likeCount = await db.like.count({
		where: {
			tweetId,
		},
	});
	console.log("# getLikeStatus: " + likeCount);
	return {
		likeCount,
		isLiked,
	};
}

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
	const item = await getCachedTweet(id);
	if (!item) {
		return notFound();
	}

	const goHome = async () => {
		"use server";
		redirect("/");
	};

	// const isLiked = await getIsLiked(id);
	const { likeCount, isLiked } = await getLikeStatus(id);
	// const { likeCount, isLiked } = await getCachedLikeStatus(id);
	// ⨯ Error: Route /tweets/6 used "cookies" inside a function cached with "unstable_cache(...)". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use "cookies" outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache
	console.log(likeCount, isLiked);

	return (
		<div className="flex flex-col gap-10 py-8 px-6">
			<div className="text-3xl text-center pt-[30vh]">✨ Detail ✨</div>
			<form action={goHome}>
				<Button mode="primary" text="Go to Home" />
			</form>
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
		</div>
	);
}
